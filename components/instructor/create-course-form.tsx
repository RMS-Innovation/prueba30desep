"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createCourse } from "@/app/actions/courses"
import { Loader2 } from "lucide-react"

interface CreateCourseFormProps {
  instructorId: string
}

export function CreateCourseForm({ instructorId }: CreateCourseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createCourse(instructorId, formData)

    if (result.success) {
      router.push(`/instructor/courses/${result.courseId}`)
    } else {
      alert(result.error || "Failed to create course")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input id="title" name="title" placeholder="e.g., Advanced Dental Implantology" required />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what students will learn in this course..."
              rows={5}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Implantology, Orthodontics, Endodontics" />
          </div>

          {/* Level and Price */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select name="level" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="99.99" required />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input id="thumbnail_url" name="thumbnail_url" type="url" placeholder="https://example.com/image.jpg" />
            <p className="text-xs text-muted-foreground">Recommended size: 1280x720px</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Course
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
