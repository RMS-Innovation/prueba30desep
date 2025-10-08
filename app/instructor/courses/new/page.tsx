import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { CreateCourseForm } from "@/components/instructor/create-course-form"

export default async function NewCoursePage() {
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

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
            <p className="text-muted-foreground mt-1">Fill in the details to create your course</p>
          </div>

          <CreateCourseForm instructorId={instructor.id} />
        </div>
      </main>
    </div>
  )
}
