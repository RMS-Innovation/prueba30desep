"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface QuestionData {
  question_text: string
  question_type: "multiple_choice" | "true_false"
  points: number
  options: Array<{
    option_text: string
    is_correct: boolean
  }>
}

export async function createQuiz(formData: FormData, questions: any[]) {
  try {
    const supabase = await getSupabaseServerClient()

    const moduleId = formData.get("module_id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const passingScore = Number.parseInt(formData.get("passing_score") as string)
    const timeLimit = formData.get("time_limit") ? Number.parseInt(formData.get("time_limit") as string) : null
    const orderIndex = Number.parseInt(formData.get("order_index") as string)

    // Create quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        module_id: moduleId,
        title,
        description,
        passing_score: passingScore,
        time_limit: timeLimit,
        order_index: orderIndex,
      })
      .select()
      .single()

    if (quizError) {
      console.error("[v0] Error creating quiz:", quizError)
      return { success: false, error: quizError.message }
    }

    // Create questions and options
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]

      const { data: questionData, error: questionError } = await supabase
        .from("quiz_questions")
        .insert({
          quiz_id: quiz.id,
          question_text: question.question_text,
          question_type: question.question_type,
          points: question.points,
          order_index: i,
        })
        .select()
        .single()

      if (questionError) {
        console.error("[v0] Error creating question:", questionError)
        continue
      }

      // Create options
      const optionsToInsert = question.options.map((option: any, j: number) => ({
        question_id: questionData.id,
        option_text: option.option_text,
        is_correct: option.is_correct,
        order_index: j,
      }))

      const { error: optionsError } = await supabase.from("quiz_options").insert(optionsToInsert)

      if (optionsError) {
        console.error("[v0] Error creating options:", optionsError)
      }
    }

    revalidatePath("/instructor/quizzes")
    return { success: true, quizId: quiz.id }
  } catch (error) {
    console.error("[v0] Error in createQuiz:", error)
    return { success: false, error: "Failed to create quiz" }
  }
}

export async function deleteQuiz(quizId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("quizzes").delete().eq("id", quizId)

    if (error) {
      console.error("[v0] Error deleting quiz:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/instructor/quizzes")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error in deleteQuiz:", error)
    return { success: false, error: "Failed to delete quiz" }
  }
}
