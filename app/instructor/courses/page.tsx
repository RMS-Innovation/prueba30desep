import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CourseCard } from "@/components/instructor/course-card"

export default async function InstructorCoursesPage() {
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

  // Get all courses for this instructor
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("instructor_id", instructor.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
              <p className="text-muted-foreground mt-1">Manage your course content and settings</p>
            </div>
            <Button asChild>
              <Link href="/instructor/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </Button>
          </div>

          {/* Courses Grid */}
          {courses && courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Get started by creating your first course. Share your dental expertise with students worldwide.
              </p>
              <Button asChild>
                <Link href="/instructor/courses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
