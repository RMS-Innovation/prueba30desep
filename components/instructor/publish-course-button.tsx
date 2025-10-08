"use client"

import { Button } from "@/components/ui/button"
import { toggleCoursePublish } from "@/app/actions/courses"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface PublishCourseButtonProps {
  courseId: string
  isPublished: boolean
}

export function PublishCourseButton({ courseId, isPublished }: PublishCourseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleToggle() {
    setIsLoading(true)
    const result = await toggleCoursePublish(courseId, !isPublished)
    if (!result.success) {
      alert(result.error || "Failed to update course status")
    }
    setIsLoading(false)
  }

  return (
    <Button onClick={handleToggle} disabled={isLoading} variant={isPublished ? "outline" : "default"}>
      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {isPublished ? "Unpublish" : "Publish"}
    </Button>
  )
}
