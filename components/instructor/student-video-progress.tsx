import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface VideoProgress {
  id: string
  watched_duration: number
  is_completed: boolean
  last_watched_at: string
  video: {
    id: string
    title: string
    duration: number
    module: {
      id: string
      title: string
    }
  }
}

interface StudentVideoProgressProps {
  videoProgress: VideoProgress[]
}

export function StudentVideoProgress({ videoProgress }: StudentVideoProgressProps) {
  if (videoProgress.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No video progress yet</p>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Group by module
  const groupedProgress = videoProgress.reduce(
    (acc, progress) => {
      const moduleTitle = progress.video.module.title
      if (!acc[moduleTitle]) {
        acc[moduleTitle] = []
      }
      acc[moduleTitle].push(progress)
      return acc
    },
    {} as Record<string, VideoProgress[]>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedProgress).map(([moduleTitle, videos]) => (
        <div key={moduleTitle}>
          <h4 className="font-semibold text-foreground mb-3">{moduleTitle}</h4>
          <div className="space-y-3">
            {videos.map((progress) => {
              const progressPercent = (progress.watched_duration / progress.video.duration) * 100

              return (
                <div key={progress.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <div className="flex-shrink-0">
                    {progress.is_completed ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : progressPercent > 0 ? (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground truncate">{progress.video.title}</p>
                      {progress.is_completed && <Badge variant="default">Completed</Badge>}
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                      <Progress value={progressPercent} className="flex-1" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDuration(progress.watched_duration)} / {formatDuration(progress.video.duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last watched {formatDate(progress.last_watched_at)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
