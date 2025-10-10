import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { StatCard } from "@/components/instructor/stat-card"
import { RecentEnrollments } from "@/components/instructor/recent-enrollments"
import { CoursePerformance } from "@/components/instructor/course-performance"
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react"

// Define tipos basados en la estructura de la base de datos
interface Course {
  id: string
  title: string
  total_enrollments: number
  price: number
}

interface Student {
  first_name: string
  last_name: string
  profile_picture_url?: string
}

interface Enrollment {
  id: string
  enrolled_at: string
  progress: number
  student: Student
  course: {
    title: string
    instructor_id: string
  }
}

interface Instructor {
  id: string
  user_id: string
  first_name: string
  last_name: string
  profile_picture_url?: string
  specialization?: string
  rating: number
}

export default async function InstructorDashboard() {
  const supabase = await getSupabaseServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get instructor profile
  const { data: instructor } = await supabase
    .from("instructors")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!instructor) {
    redirect("/login")
  }

  // Get instructor stats
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, total_enrollments, price")
    .eq("instructor_id", instructor.id)

  const coursesData: Course[] = courses || []
  const totalCourses = coursesData.length
  const totalStudents = coursesData.reduce((sum, course) => sum + (course.total_enrollments || 0), 0)

  // Calculate total revenue
  const totalRevenue = coursesData.reduce((sum, course) => sum + course.price * (course.total_enrollments || 0), 0)

  // Get recent enrollments - corregir la consulta
  const { data: recentEnrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      enrolled_at,
      progress,
      student:students!inner(first_name, last_name, profile_picture_url),
      course:courses!inner(title, instructor_id)
    `)
    .eq("course.instructor_id", instructor.id)
    .order("enrolled_at", { ascending: false })
    .limit(5)

  // Transformar los datos para que coincidan con el tipo esperado por RecentEnrollments
  const formattedEnrollments: Enrollment[] = (recentEnrollments || []).map(enrollment => {
    // Asegurar que student no sea un array
    const studentData = Array.isArray(enrollment.student) 
      ? enrollment.student[0] 
      : enrollment.student
    
    // Asegurar que course no sea un array
    const courseData = Array.isArray(enrollment.course)
      ? enrollment.course[0]
      : enrollment.course

    return {
      id: enrollment.id,
      enrolled_at: enrollment.enrolled_at,
      progress: Number(enrollment.progress) || 0,
      student: {
        first_name: studentData?.first_name || 'Unknown',
        last_name: studentData?.last_name || 'Student',
        profile_picture_url: studentData?.profile_picture_url || '',
      },
      course: {
        title: courseData?.title || 'Unknown Course',
        instructor_id: courseData?.instructor_id || '',
      }
    }
  })

  // Prepare course performance data
  const coursePerformanceData = coursesData.slice(0, 5).map((course) => ({
    name: course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title,
    enrollments: course.total_enrollments || 0,
    revenue: course.price * (course.total_enrollments || 0),
  }))

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, Dr. {instructor.first_name}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Courses"
              value={totalCourses}
              icon={BookOpen}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Students"
              value={totalStudents}
              icon={Users}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Avg. Rating"
              value={Number(instructor.rating).toFixed(1)}
              icon={TrendingUp}
            />
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <CoursePerformance data={coursePerformanceData} />
            <RecentEnrollments enrollments={formattedEnrollments} />
          </div>
        </div>
      </main>
    </div>
  )
}