import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Clock, Target } from "lucide-react"
import Link from "next/link"
import { QuizQuestionsView } from "@/components/instructor/quiz-questions-view"

export default async function QuizDetailPage({ params }: { params: { quizId: string } }) {
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

  // Get quiz details
  const { data: quiz } = await supabase
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
      )
    `,
    )
    .eq("id", params.quizId)
    .single()

  if (!quiz || (quiz.module as any).course.instructor_id !== instructor.id) {
    redirect("/instructor/quizzes")
  }

  // Get questions with options
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select(
      `
      *,
      quiz_options(*)
    `,
    )
    .eq("quiz_id", params.quizId)
    .order("order_index", { ascending: true })

  const module = quiz.module as any

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/instructor/quizzes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Link>
          </Button>

          {/* Quiz Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">{quiz.title}</h1>
                  <p className="text-sm text-muted-foreground mb-3">
                    {module.course.title} • {module.title}
                  </p>
                  {quiz.description && <p className="text-muted-foreground">{quiz.description}</p>}
                </div>
                <Button asChild>
                  <Link href={`/instructor/quizzes/${quiz.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Quiz
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="gap-1">
                  <Target className="h-3 w-3" />
                  Passing Score: {quiz.passing_score}%
                </Badge>
                {quiz.time_limit && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Time Limit: {quiz.time_limit} minutes
                  </Badge>
                )}
                <Badge variant="outline">{questions?.length || 0} Questions</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuizQuestionsView questions={questions || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
