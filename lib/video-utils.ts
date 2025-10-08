import { createServerSupabaseClient } from "./supabase"

export interface VideoUploadResult {
  success: boolean
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  error?: string
}

export interface VideoProcessingJob {
  id: string
  status: "pending" | "processing" | "completed" | "failed"
  originalUrl: string
  processedUrl?: string
  thumbnailUrl?: string
  duration?: number
  metadata?: any
}

// Generate thumbnail from video using canvas (client-side)
export const generateVideoThumbnail = (videoFile: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    video.addEventListener("loadedmetadata", () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Seek to 10% of video duration for thumbnail
      video.currentTime = video.duration * 0.1
    })

    video.addEventListener("seeked", () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to generate thumbnail"))
            }
          },
          "image/jpeg",
          0.8,
        )
      }
    })

    video.addEventListener("error", () => {
      reject(new Error("Failed to load video"))
    })

    video.src = URL.createObjectURL(videoFile)
    video.load()
  })
}

// Get video duration
export const getVideoDuration = (videoFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")

    video.addEventListener("loadedmetadata", () => {
      resolve(video.duration)
    })

    video.addEventListener("error", () => {
      reject(new Error("Failed to load video"))
    })

    video.src = URL.createObjectURL(videoFile)
    video.load()
  })
}

// Server-side video processing utilities
export const processVideoWithFFmpeg = async (
  inputPath: string,
  outputPath: string,
  options: {
    quality?: "low" | "medium" | "high"
    format?: "mp4" | "webm"
    generateThumbnail?: boolean
  } = {},
): Promise<VideoProcessingJob> => {
  // This would typically use a queue system like Bull or a serverless function
  // For now, we'll simulate the processing

  const job: VideoProcessingJob = {
    id: crypto.randomUUID(),
    status: "processing",
    originalUrl: inputPath,
  }

  try {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real implementation, you would:
    // 1. Use FFmpeg to transcode the video
    // 2. Generate multiple quality versions
    // 3. Extract thumbnail frames
    // 4. Upload processed files to storage

    job.status = "completed"
    job.processedUrl = outputPath
    job.thumbnailUrl = outputPath.replace(".mp4", "_thumb.jpg")
    job.duration = 300 // Mock duration

    return job
  } catch (error) {
    job.status = "failed"
    throw error
  }
}

// Upload video to Supabase Storage
export const uploadVideoToStorage = async (
  file: File,
  bucket = "videos",
  folder = "courses",
): Promise<VideoUploadResult> => {
  try {
    const supabase = createServerSupabaseClient()

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload original file
    const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return {
      success: true,
      videoUrl: urlData.publicUrl,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}
