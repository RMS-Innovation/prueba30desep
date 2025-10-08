import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Clock, Edit, Trash2 } from "lucide-react"

interface Video {
  id: string
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration: number
  is_preview: boolean
  module: {
    title: string
    course: {
      title: string
    }
  }
}

interface VideosListProps {
  videos: Video[]
}

export function VideosList({ videos }: VideosListProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="rounded-full bg-muted p-6 mb-4 inline-block">
          <Play className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No videos yet</h3>
        <p className="text-muted-foreground">Upload your first video to get started</p>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <div className="aspect-video relative bg-muted">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url || "/placeholder.svg"}
                alt={video.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Play className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(video.duration)}
            </div>
            {video.is_preview && (
              <div className="absolute top-2 left-2">
                <Badge>Preview</Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{video.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">
              {video.module.course.title} • {video.module.title}
            </p>
            {video.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.description}</p>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
