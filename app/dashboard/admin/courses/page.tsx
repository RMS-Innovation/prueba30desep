import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CoursesTable } from "@/components/admin/courses-table"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { BookOpen, CheckCircle, Clock, Star } from "lucide-react"

async function getCourses() {
  const supabase = await getSupabaseServerClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      *,
      instructors (
        users (
          first_name,
          last_name
        )
      ),
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching courses:", error)
    return []
  }

  return courses || []
}

export default async function CoursesPage() {
  const courses = await getCourses()

  const totalCourses = courses.length
  const publishedCourses = courses.filter((c: any) => c.is_published).length
  const draftCourses = courses.filter((c: any) => !c.is_published).length
  const featuredCourses = courses.filter((c: any) => c.is_featured).length

  const handleViewCourse = (courseId: string) => {
    console.log("[v0] View course:", courseId)
  }

  const handleApproveCourse = (courseId: string) => {
    console.log("[v0] Approve course:", courseId)
  }

  const handleRejectCourse = (courseId: string) => {
    console.log("[v0] Reject course:", courseId)
  }

  const handleToggleFeatured = (courseId: string, isFeatured: boolean) => {
    console.log("[v0] Toggle featured:", courseId, isFeatured)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">Review, approve, and manage all courses on the platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">All courses</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCourses}</div>
            <p className="text-xs text-muted-foreground">Live on platform</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCourses}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCourses}</div>
            <p className="text-xs text-muted-foreground">Highlighted courses</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>Review and manage course content, approvals, and visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <CoursesTable
            courses={courses}
            onViewCourse={handleViewCourse}
            onApproveCourse={handleApproveCourse}
            onRejectCourse={handleRejectCourse}
            onToggleFeatured={handleToggleFeatured}
          />
        </CardContent>
      </Card>
    </div>
  )
}
