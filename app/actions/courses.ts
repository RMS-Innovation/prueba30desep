"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCourse(instructorId: string, formData: FormData) {
  try {
    const supabase = await getSupabaseServerClient()

    const courseData = {
      instructor_id: instructorId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      level: formData.get("level") as string,
      price: Number.parseFloat(formData.get("price") as string),
      thumbnail_url: formData.get("thumbnail_url") as string,
      is_published: false,
    }

    const { data, error } = await supabase.from("courses").insert(courseData).select().single()

    if (error) {
      console.error("[v0] Error creating course:", error)
      return { success: false, error: error.message }
    }

    // Update instructor's total courses count
    await supabase.rpc("increment_instructor_courses", { instructor_id: instructorId })

    revalidatePath("/instructor/courses")
    return { success: true, courseId: data.id }
  } catch (error) {
    console.error("[v0] Error in createCourse:", error)
    return { success: false, error: "Failed to create course" }
  }
}

export async function updateCourse(courseId: string, formData: FormData) {
  try {
    const supabase = await getSupabaseServerClient()

    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      level: formData.get("level") as string,
      price: Number.parseFloat(formData.get("price") as string),
      thumbnail_url: formData.get("thumbnail_url") as string,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("courses").update(courseData).eq("id", courseId)

    if (error) {
      console.error("[v0] Error updating course:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/instructor/courses")
    revalidatePath(`/instructor/courses/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error in updateCourse:", error)
    return { success: false, error: "Failed to update course" }
  }
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
  try {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("courses").update({ is_published: isPublished }).eq("id", courseId)

    if (error) {
      console.error("[v0] Error toggling course publish:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/instructor/courses")
    revalidatePath(`/instructor/courses/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error in toggleCoursePublish:", error)
    return { success: false, error: "Failed to update course status" }
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("courses").delete().eq("id", courseId)

    if (error) {
      console.error("[v0] Error deleting course:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/instructor/courses")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error in deleteCourse:", error)
    return { success: false, error: "Failed to delete course" }
  }
}
