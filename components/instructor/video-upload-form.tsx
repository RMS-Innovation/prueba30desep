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
import { Checkbox } from "@/components/ui/checkbox"
import { uploadVideo } from "@/app/actions/videos"
import { Loader2, Upload, FileVideo } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Course {
  id: string
  title: string
  modules: Array<{
    id: string
    title: string
    order_index: number
  }>
}

interface VideoUploadFormProps {
  courses: Course[]
}

export function VideoUploadForm({ courses }: VideoUploadFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const selectedCourseData = courses.find((c) => c.id === selectedCourse)
  const modules = selectedCourseData?.modules || []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setUploadProgress(0)

    const formData = new FormData(e.currentTarget)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    const result = await uploadVideo(formData)

    clearInterval(progressInterval)
    setUploadProgress(100)

    if (result.success) {
      setTimeout(() => {
        router.push("/instructor/videos")
      }, 500)
    } else {
      alert(result.error || "Failed to upload video")
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Course Selection */}
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

          {/* Module Selection */}
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
            {!selectedCourse && <p className="text-xs text-muted-foreground">Select a course first</p>}
          </div>

          {/* Video File Upload */}
          <div className="space-y-2">
            <Label htmlFor="video_file">Video File *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="video_file"
                name="video_file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label htmlFor="video_file" className="cursor-pointer">
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileVideo className="h-12 w-12 text-primary" />
                    <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Click to upload video</p>
                    <p className="text-xs text-muted-foreground">MP4, MOV, AVI up to 500MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Video Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Video Title *</Label>
            <Input id="title" name="title" placeholder="e.g., Introduction to Dental Implants" required />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what students will learn in this video..."
              rows={4}
            />
          </div>

          {/* Duration and Order */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds) *</Label>
              <Input id="duration" name="duration" type="number" min="1" placeholder="300" required />
              <p className="text-xs text-muted-foreground">Approximate video length</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_index">Order Index *</Label>
              <Input id="order_index" name="order_index" type="number" min="0" placeholder="0" required />
              <p className="text-xs text-muted-foreground">Position in module (0 = first)</p>
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input id="thumbnail_url" name="thumbnail_url" type="url" placeholder="https://example.com/thumbnail.jpg" />
          </div>

          {/* Is Preview */}
          <div className="flex items-center space-x-2">
            <Checkbox id="is_preview" name="is_preview" />
            <Label htmlFor="is_preview" className="text-sm font-normal cursor-pointer">
              Make this video available as a free preview
            </Label>
          </div>

          {/* Upload Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading video...</span>
                <span className="font-medium text-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Upload Video
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
