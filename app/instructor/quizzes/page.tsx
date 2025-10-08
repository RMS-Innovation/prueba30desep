import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { QuizzesList } from "@/components/instructor/quizzes-list"

export default async function InstructorQuizzesPage() {
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

  // Get all quizzes for instructor's courses
  const { data: quizzes } = await supabase
    .from("quizzes")
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
      ),
      quiz_questions(count)
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
              <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
              <p className="text-muted-foreground mt-1">Create and manage course assessments</p>
            </div>
            <Button asChild>
              <Link href="/instructor/quizzes/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Link>
            </Button>
          </div>

          <QuizzesList quizzes={quizzes || []} />
        </div>
      </main>
    </div>
  )
}
