import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"

interface QuizOption {
  id: string
  option_text: string
  is_correct: boolean
  order_index: number
}

interface QuizQuestion {
  id: string
  question_text: string
  question_type: string
  points: number
  order_index: number
  quiz_options: QuizOption[]
}

interface QuizQuestionsViewProps {
  questions: QuizQuestion[]
}

export function QuizQuestionsView({ questions }: QuizQuestionsViewProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No questions added yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">Question {index + 1}</span>
                <Badge variant="secondary">
                  {question.points} point{question.points !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline">
                  {question.question_type === "multiple_choice" ? "Multiple Choice" : "True/False"}
                </Badge>
              </div>
              <p className="text-foreground">{question.question_text}</p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {question.quiz_options
              .sort((a, b) => a.order_index - b.order_index)
              .map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    option.is_correct ? "border-accent bg-accent/10" : "border-border bg-muted/30"
                  }`}
                >
                  {option.is_correct ? (
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={option.is_correct ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {option.option_text}
                  </span>
                  {option.is_correct && (
                    <Badge variant="default" className="ml-auto">
                      Correct
                    </Badge>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
