"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateInstructorProfile(instructorId: string, formData: FormData) {
  try {
    const supabase = await getSupabaseServerClient()

    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const bio = formData.get("bio") as string
    const expertise = formData.get("expertise") as string
    const profilePictureUrl = formData.get("profile_picture_url") as string

    const { error } = await supabase
      .from("instructors")
      .update({
        first_name: firstName,
        last_name: lastName,
        bio: bio || null,
        expertise: expertise || null,
        profile_picture_url: profilePictureUrl || null,
      })
      .eq("id", instructorId)

    if (error) {
      console.error("[v0] Error updating instructor profile:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/instructor/settings")
    revalidatePath("/instructor")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error in updateInstructorProfile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}
