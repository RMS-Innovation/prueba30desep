"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateInstructorProfile } from "@/app/actions/instructor"
import { Loader2 } from "lucide-react"

interface InstructorSettingsFormProps {
  instructor: {
    id: string
    first_name: string
    last_name: string
    bio?: string
    profile_picture_url?: string
    expertise?: string
  }
  userEmail: string
}

export function InstructorSettingsForm({ instructor, userEmail }: InstructorSettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await updateInstructorProfile(instructor.id, formData)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || "Failed to update profile")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input id="first_name" name="first_name" defaultValue={instructor.first_name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input id="last_name" name="last_name" defaultValue={instructor.last_name} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={userEmail} disabled />
        <p className="text-xs text-muted-foreground">Email cannot be changed from this page</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expertise">Expertise</Label>
        <Input
          id="expertise"
          name="expertise"
          placeholder="e.g., Dental Implants, Orthodontics"
          defaultValue={instructor.expertise || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Tell students about yourself..."
          rows={4}
          defaultValue={instructor.bio || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile_picture_url">Profile Picture URL</Label>
        <Input
          id="profile_picture_url"
          name="profile_picture_url"
          type="url"
          placeholder="https://example.com/photo.jpg"
          defaultValue={instructor.profile_picture_url || ""}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}
