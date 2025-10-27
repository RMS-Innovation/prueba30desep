"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Video {
  id: number
  title: string
  duration: string
  completed: boolean
  locked: boolean
}

interface Module {
  id: number
  title: string
  videos: Video[]
}

interface ModuleListProps {
  modules: Module[]
  currentVideoId: number
  onVideoSelect: (videoId: number) => void
}

export function ModuleList({ modules, currentVideoId, onVideoSelect }: ModuleListProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Contenido del Curso</h3>
      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900">{module.title}</h4>
            <div className="space-y-1">
              {module.videos.map((video) => (
                <Button
                  key={video.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-auto py-3 px-3",
                    currentVideoId === video.id && "bg-purple-50 text-purple-900",
                    video.locked && "opacity-50 cursor-not-allowed",
                  )}
                  onClick={() => !video.locked && onVideoSelect(video.id)}
                  disabled={video.locked}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="mt-0.5">
                      {video.locked ? (
                        <Lock className="h-4 w-4 text-gray-400" />
                      ) : video.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : currentVideoId === video.id ? (
                        <PlayCircle className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{video.duration}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
