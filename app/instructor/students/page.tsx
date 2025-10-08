import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentsList } from "@/components/instructor/students-list"
import { Users, GraduationCap, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/instructor/stat-card"

export default async function InstructorStudentsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: instructor } = await supabase.from("instructors").select("*").eq("user_id", user.id).single()

  if (!instructor) {
    redirect("/login")
  }

  // Get all enrollments for instructor's courses
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      enrolled_at,
      progress,
      completed_at,
      student:students(
        id,
        first_name,
        last_name,
        profile_picture_url
      ),
      course:courses!inner(
        id,
        title,
        instructor_id
      )
    `,
    )
    .eq("course.instructor_id", instructor.id)
    .order("enrolled_at", { ascending: false })

  // Calculate stats
  const totalStudents = new Set(enrollments?.map((e: any) => e.student.id)).size
  const completedEnrollments = enrollments?.filter((e: any) => e.completed_at).length || 0
  const avgProgress =
    enrollments?.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / (enrollments?.length || 1) || 0

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">Track your students' progress and engagement</p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <StatCard title="Total Students" value={totalStudents} icon={Users} />
            <StatCard title="Completed Courses" value={completedEnrollments} icon={GraduationCap} />
            <StatCard title="Avg. Progress" value={`${avgProgress.toFixed(1)}%`} icon={TrendingUp} />
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Input placeholder="Search students..." />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Progress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Progress</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentsList enrollments={enrollments || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
