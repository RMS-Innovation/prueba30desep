import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileQuestion, Clock, Edit, Trash2, Eye, Plus } from "lucide-react"
import Link from "next/link"

interface Quiz {
  id: string
  title: string
  description?: string
  passing_score: number
  time_limit?: number
  module: {
    title: string
    course: {
      title: string
    }
  }
  quiz_questions: any[]
}

interface QuizzesListProps {
  quizzes: Quiz[]
}

export function QuizzesList({ quizzes }: QuizzesListProps) {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="rounded-full bg-muted p-6 mb-4 inline-block">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No quizzes yet</h3>
        <p className="text-muted-foreground mb-6">Create your first quiz to assess student knowledge</p>
        <Button asChild>
          <Link href="/instructor/quizzes/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => {
        const questionCount = quiz.quiz_questions?.length || 0

        return (
          <Card key={quiz.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileQuestion className="h-5 w-5 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/instructor/quizzes/${quiz.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{quiz.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {quiz.module.course.title} • {quiz.module.title}
              </p>

              {quiz.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{quiz.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{questionCount} Questions</Badge>
                <Badge variant="outline">Pass: {quiz.passing_score}%</Badge>
                {quiz.time_limit && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {quiz.time_limit}min
                  </Badge>
                )}
              </div>

              <Button variant="outline" className="w-full bg-transparent" size="sm" asChild>
                <Link href={`/instructor/quizzes/${quiz.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
