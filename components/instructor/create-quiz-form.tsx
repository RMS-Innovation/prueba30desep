"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createQuiz } from "@/app/actions/quizzes"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Course {
  id: string
  title: string
  modules: Array<{
    id: string
    title: string
    order_index: number
  }>
}

interface CreateQuizFormProps {
  courses: Course[]
}

interface Question {
  id: string
  question_text: string
  question_type: "multiple_choice" | "true_false"
  points: number
  options: Array<{
    id: string
    option_text: string
    is_correct: boolean
  }>
}

export function CreateQuizForm({ courses }: CreateQuizFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [questions, setQuestions] = useState<Question[]>([])

  const selectedCourseData = courses.find((c) => c.id === selectedCourse)
  const modules = selectedCourseData?.modules || []

  function addQuestion() {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      options: [
        { id: `o-${Date.now()}-1`, option_text: "", is_correct: false },
        { id: `o-${Date.now()}-2`, option_text: "", is_correct: false },
      ],
    }
    setQuestions([...questions, newQuestion])
  }

  function removeQuestion(questionId: string) {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  function updateQuestion(questionId: string, field: string, value: any) {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, [field]: value }
        }
        return q
      }),
    )
  }

  function addOption(questionId: string) {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...q.options, { id: `o-${Date.now()}`, option_text: "", is_correct: false }],
          }
        }
        return q
      }),
    )
  }

  function removeOption(questionId: string, optionId: string) {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          }
        }
        return q
      }),
    )
  }

  function updateOption(questionId: string, optionId: string, field: string, value: any) {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) => {
              if (o.id === optionId) {
                return { ...o, [field]: value }
              }
              return o
            }),
          }
        }
        return q
      }),
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createQuiz(formData, questions)

    if (result.success) {
      router.push(`/instructor/quizzes/${result.quizId}`)
    } else {
      alert(result.error || "Failed to create quiz")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select name="course" value={selectedCourse} onValueChange={setSelectedCourse} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="module_id">Module *</Label>
            <Select name="module_id" disabled={!selectedCourse} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title *</Label>
            <Input id="title" name="title" placeholder="e.g., Module 1 Assessment" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe what this quiz covers..." rows={3} />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="passing_score">Passing Score (%) *</Label>
              <Input
                id="passing_score"
                name="passing_score"
                type="number"
                min="0"
                max="100"
                defaultValue="70"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time_limit">Time Limit (minutes)</Label>
              <Input id="time_limit" name="time_limit" type="number" min="1" placeholder="30" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_index">Order Index *</Label>
              <Input id="order_index" name="order_index" type="number" min="0" defaultValue="0" required />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions</CardTitle>
            <Button type="button" onClick={addQuestion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No questions added yet</p>
              <Button type="button" onClick={addQuestion} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Question
              </Button>
            </div>
          ) : (
            questions.map((question, qIndex) => (
              <Card key={question.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-foreground">Question {qIndex + 1}</h4>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(question.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text *</Label>
                    <Textarea
                      value={question.question_text}
                      onChange={(e) => updateQuestion(question.id, "question_text", e.target.value)}
                      placeholder="Enter your question..."
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Question Type *</Label>
                      <Select
                        value={question.question_type}
                        onValueChange={(value) => updateQuestion(question.id, "question_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Points *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, "points", Number.parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Answer Options *</Label>
                      {question.question_type === "multiple_choice" && (
                        <Button type="button" size="sm" variant="outline" onClick={() => addOption(question.id)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Option
                        </Button>
                      )}
                    </div>

                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={option.is_correct}
                          onCheckedChange={(checked) => updateOption(question.id, option.id, "is_correct", checked)}
                        />
                        <Input
                          value={option.option_text}
                          onChange={(e) => updateOption(question.id, option.id, "option_text", e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1"
                          required
                        />
                        {question.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(question.id, option.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading || questions.length === 0}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Create Quiz
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
