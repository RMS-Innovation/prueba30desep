import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { StatCard } from "@/components/instructor/stat-card"
import { RecentEnrollments } from "@/components/instructor/recent-enrollments"
import { CoursePerformance } from "@/components/instructor/course-performance"
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react"

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
  const { data: instructor } = await supabase.from("instructors").select("*").eq("user_id", user.id).single()

  if (!instructor) {
    redirect("/login")
  }

  // Get instructor stats
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, total_enrollments, price")
    .eq("instructor_id", instructor.id)

  const totalCourses = courses?.length || 0
  const totalStudents = courses?.reduce((sum, course) => sum + (course.total_enrollments || 0), 0) || 0

  // Calculate total revenue (mock calculation)
  const totalRevenue = courses?.reduce((sum, course) => sum + course.price * (course.total_enrollments || 0), 0) || 0

  // Get recent enrollments
  const { data: recentEnrollments } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      enrolled_at,
      progress,
      student:students(first_name, last_name, profile_picture_url),
      course:courses!inner(title, instructor_id)
    `,
    )
    .eq("course.instructor_id", instructor.id)
    .order("enrolled_at", { ascending: false })
    .limit(5)

  // Prepare course performance data
  const coursePerformanceData =
    courses?.slice(0, 5).map((course) => ({
      name: course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title,
      enrollments: course.total_enrollments || 0,
      revenue: course.price * (course.total_enrollments || 0),
    })) || []

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
              trend={{ value: "12% from last month", isPositive: true }}
            />
            <StatCard
              title="Total Students"
              value={totalStudents}
              icon={Users}
              trend={{ value: "8% from last month", isPositive: true }}
            />
            <StatCard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: "15% from last month", isPositive: true }}
            />
            <StatCard
              title="Avg. Rating"
              value={instructor.rating.toFixed(1)}
              icon={TrendingUp}
              description="Based on student reviews"
            />
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <CoursePerformance data={coursePerformanceData} />
            <RecentEnrollments enrollments={recentEnrollments || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
