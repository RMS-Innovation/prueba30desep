"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, Award } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuizQuestion {
  id: number
  question: string
  options: Array<{
    id: number
    text: string
  }>
  correctAnswerId: number
  explanation?: string
}

export interface Quiz {
  id: number
  title: string
  description: string
  questions: QuizQuestion[]
  passingScore: number
}

interface QuizViewerProps {
  quiz: Quiz
  onComplete: (score: number, answers: Record<number, number>) => void
  savedAnswers?: Record<number, number>
  savedScore?: number
}

export function QuizViewer({ quiz, onComplete, savedAnswers, savedScore }: QuizViewerProps) {
  const [answers, setAnswers] = useState<Record<number, number>>(savedAnswers || {})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(savedScore || 0)

  const handleSubmit = () => {
    let correctCount = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswerId) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)
    onComplete(correctCount, answers)
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const allQuestionsAnswered = quiz.questions.every((q) => answers[q.id] !== undefined)
  const passed = score >= quiz.passingScore
  const percentage = Math.round((score / quiz.questions.length) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <p className="text-gray-600 mt-2">{quiz.description}</p>
            </div>
            {submitted && (
              <Badge className={cn("text-lg px-4 py-2", passed ? "bg-green-600" : "bg-red-600")}>{percentage}%</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{quiz.questions.length} preguntas</span>
            <span>•</span>
            <span>
              Puntaje mínimo: {quiz.passingScore}/{quiz.questions.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {submitted && (
        <Card className={cn("border-2", passed ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {passed ? (
                <>
                  <Award className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">¡Felicitaciones! Has aprobado</h3>
                    <p className="text-sm text-green-700">
                      Obtuviste {score} de {quiz.questions.length} respuestas correctas
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">No alcanzaste el puntaje mínimo</h3>
                    <p className="text-sm text-red-700">
                      Obtuviste {score} de {quiz.questions.length}. Necesitas al menos {quiz.passingScore} para aprobar
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const isCorrect = submitted && answers[question.id] === question.correctAnswerId
          const isIncorrect = submitted && answers[question.id] !== question.correctAnswerId

          return (
            <Card
              key={question.id}
              className={cn(
                submitted &&
                  (isCorrect ? "border-green-500 bg-green-50" : isIncorrect ? "border-red-500 bg-red-50" : ""),
              )}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium">{question.question}</CardTitle>
                  </div>
                  {submitted && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[question.id]?.toString()}
                  onValueChange={(value) => {
                    if (!submitted) {
                      setAnswers({ ...answers, [question.id]: Number.parseInt(value) })
                    }
                  }}
                  disabled={submitted}
                >
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const isSelected = answers[question.id] === option.id
                      const isCorrectOption = option.id === question.correctAnswerId
                      const showAsCorrect = submitted && isCorrectOption
                      const showAsIncorrect = submitted && isSelected && !isCorrectOption

                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors",
                            !submitted && "hover:bg-gray-50",
                            showAsCorrect && "border-green-500 bg-green-50",
                            showAsIncorrect && "border-red-500 bg-red-50",
                            !submitted && isSelected && "border-purple-500 bg-purple-50",
                          )}
                        >
                          <RadioGroupItem value={option.id.toString()} id={`q${question.id}-o${option.id}`} />
                          <Label
                            htmlFor={`q${question.id}-o${option.id}`}
                            className="flex-1 cursor-pointer font-normal"
                          >
                            {option.text}
                          </Label>
                          {showAsCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                          {showAsIncorrect && <XCircle className="h-5 w-5 text-red-600" />}
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>

                {submitted && question.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Explicación:</p>
                    <p className="text-sm text-blue-800">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex gap-3">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!allQuestionsAnswered} size="lg" className="bg-purple-600">
            Enviar Respuestas
          </Button>
        ) : (
          <>
            {!passed && (
              <Button onClick={handleRetry} size="lg" variant="outline">
                Reintentar
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
