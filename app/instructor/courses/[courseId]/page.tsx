import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { CourseModulesList } from "@/components/instructor/course-modules-list"
import { PublishCourseButton } from "@/components/instructor/publish-course-button"

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
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

  // Get course details
  const { data: course } = await supabase.from("courses").select("*").eq("id", params.courseId).single()

  if (!course || course.instructor_id !== instructor.id) {
    redirect("/instructor/courses")
  }

  // Get modules with videos count
  const { data: modules } = await supabase
    .from("modules")
    .select("*, videos(count)")
    .eq("course_id", params.courseId)
    .order("order_index", { ascending: true })

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
                <Badge variant={course.is_published ? "default" : "secondary"}>
                  {course.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/instructor/courses/${course.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/instructor/courses/${course.id}/preview`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <PublishCourseButton courseId={course.id} isPublished={course.is_published} />
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-foreground">{modules?.length || 0}</div>
                <p className="text-sm text-muted-foreground">Modules</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-foreground">
                  {modules?.reduce((sum, m: any) => sum + (m.videos?.[0]?.count || 0), 0) || 0}
                </div>
                <p className="text-sm text-muted-foreground">Videos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-foreground">{course.total_enrollments || 0}</div>
                <p className="text-sm text-muted-foreground">Students Enrolled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-foreground">${course.price}</div>
                <p className="text-sm text-muted-foreground">Course Price</p>
              </CardContent>
            </Card>
          </div>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Content</CardTitle>
                <Button asChild>
                  <Link href={`/instructor/courses/${course.id}/modules/new`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CourseModulesList courseId={course.id} modules={modules || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
