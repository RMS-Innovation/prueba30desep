import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { VideoUploadForm } from "@/components/instructor/video-upload-form"

export default async function VideoUploadPage() {
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

  // Get all courses and their modules for this instructor
  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      modules(
        id,
        title,
        order_index
      )
    `,
    )
    .eq("instructor_id", instructor.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Upload Video</h1>
            <p className="text-muted-foreground mt-1">Add a new video to your course</p>
          </div>

          <VideoUploadForm courses={courses || []} />
        </div>
      </main>
    </div>
  )
}
