import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { VideosList } from "@/components/instructor/videos-list"

export default async function InstructorVideosPage() {
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

  // Get all videos for this instructor's courses
  const { data: videos } = await supabase
    .from("videos")
    .select(
      `
      *,
      module:modules!inner(
        id,
        title,
        course:courses!inner(
          id,
          title,
          instructor_id
        )
      )
    `,
    )
    .eq("module.course.instructor_id", instructor.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Videos</h1>
              <p className="text-muted-foreground mt-1">Manage all your course videos</p>
            </div>
            <Button asChild>
              <Link href="/instructor/videos/upload">
                <Plus className="h-4 w-4 mr-2" />
                Upload Video
              </Link>
            </Button>
          </div>

          <VideosList videos={videos || []} />
        </div>
      </main>
    </div>
  )
}
