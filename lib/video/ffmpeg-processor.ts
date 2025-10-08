// Video processing utilities for FFmpeg preprocessing
// Note: FFmpeg processing would typically happen server-side or via a serverless function

export interface VideoMetadata {
  duration: number
  width: number
  height: number
  format: string
  size: number
}

export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  // In a real implementation, this would use FFmpeg to extract metadata
  // For now, we'll return mock data based on file properties
  return new Promise((resolve) => {
    const video = document.createElement("video")
    video.preload = "metadata"

    video.onloadedmetadata = () => {
      resolve({
        duration: Math.floor(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
        format: file.type,
        size: file.size,
      })
      URL.revokeObjectURL(video.src)
    }

    video.src = URL.createObjectURL(file)
  })
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 500 * 1024 * 1024 // 500MB
  const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"]

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Please upload MP4, MOV, AVI, or WebM" }
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 500MB limit" }
  }

  return { valid: true }
}

export async function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(2, video.duration / 2) // Seek to 2 seconds or middle
    }

    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob))
        } else {
          reject(new Error("Failed to generate thumbnail"))
        }
        URL.revokeObjectURL(video.src)
      }, "image/jpeg")
    }

    video.onerror = () => {
      reject(new Error("Failed to load video"))
      URL.revokeObjectURL(video.src)
    }

    video.src = URL.createObjectURL(file)
  })
}
