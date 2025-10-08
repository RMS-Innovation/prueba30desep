"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadVideo(formData: FormData) {
  try {
    const supabase = await getSupabaseServerClient()

    const moduleId = formData.get("module_id") as string
    const videoFile = formData.get("video_file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const duration = Number.parseInt(formData.get("duration") as string)
    const orderIndex = Number.parseInt(formData.get("order_index") as string)
    const thumbnailUrl = formData.get("thumbnail_url") as string
    const isPreview = formData.get("is_preview") === "on"

    // Upload video to Supabase Storage
    const fileName = `${Date.now()}-${videoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("course-videos")
      .upload(fileName, videoFile)

    if (uploadError) {
      console.error("[v0] Error uploading video file:", uploadError)
      return { success: false, error: "Failed to upload video file" }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("course-videos").getPublicUrl(fileName)

    // Create video record in database
    const videoData = {
      module_id: moduleId,
      title,
      description,
      video_url: publicUrl,
      thumbnail_url: thumbnailUrl || null,
      duration,
      order_index: orderIndex,
      is_preview: isPreview,
    }

    const { data, error } = await supabase.from("videos").insert(videoData).select().single()

    if (error) {
      console.error("[v0] Error creating video record:", error)
      // Clean up uploaded file
      await supabase.storage.from("course-videos").remove([fileName])
      return { success: false, error: error.message }
    }

    revalidatePath("/instructor/videos")
    return { success: true, videoId: data.id }
  } catch (error) {
    console.error("[v0] Error in uploadVideo:", error)
    return { success: false, error: "Failed to upload video" }
  }
}

export async function deleteVideo(videoId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get video details to delete from storage
    const { data: video } = await supabase.from("videos").select("video_url").eq("id", videoId).single()

    if (video?.video_url) {
      // Extract filename from URL
      const fileName = video.video_url.split("/").pop()
      if (fileName) {
        await supabase.storage.from("course-videos").remove([fileName])
      }
    }

    // Delete video record
    const { error } = await supabase.from("videos").delete().eq("id", videoId)

    if (error) {
      console.error("[v0] Error deleting video:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/instructor/videos")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error in deleteVideo:", error)
    return { success: false, error: "Failed to delete video" }
  }
}
