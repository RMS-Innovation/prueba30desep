"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"

interface StudentAvatarProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showBorder?: boolean
}

export function StudentAvatar({ size = "md", className = "", showBorder = true }: StudentAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [hasImage, setHasImage] = useState(false)
  const [loading, setLoading] = useState(true)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  useEffect(() => {
    async function fetchProfileImage() {
      try {
        console.log("[v0] Fetching profile image...")
        const response = await fetch("/api/student/profile-image")
        console.log("[v0] Profile image response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Profile image data:", data)
          setHasImage(data.hasImage)
          setImageUrl(data.imageUrl)
        } else {
          console.log("[v0] Profile image API error:", response.status, response.statusText)
          setHasImage(false)
          setImageUrl(null)
        }
      } catch (error) {
        console.error("[v0] Error fetching profile image:", error)
        setHasImage(false)
        setImageUrl(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileImage()
  }, [])

  if (loading) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse ${showBorder ? "ring-2 ring-purple-200" : ""} ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden ${showBorder ? "ring-2 ring-purple-200" : ""} ${className}`}
    >
      {hasImage && imageUrl ? (
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Foto de perfil"
          className="w-full h-full object-cover"
          onError={() => {
            console.log("[v0] Image failed to load, falling back to default")
            setHasImage(false)
            setImageUrl(null)
          }}
        />
      ) : (
        <div className="w-full h-full bg-purple-100 flex items-center justify-center">
          <User className={`${iconSizes[size]} text-purple-600`} />
        </div>
      )}
    </div>
  )
}
