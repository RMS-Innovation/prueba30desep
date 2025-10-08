"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoPlayer } from "./video-player"
import { Play, Clock, Eye, EyeOff, Edit, Trash2 } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number
  order_index: number
  is_preview: boolean
  created_at: string
}

interface VideoListProps {
  courseId: string
  canEdit?: boolean
  onVideoSelect?: (video: Video) => void
}

export function VideoList({ courseId, canEdit = false, onVideoSelect }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [courseId])

  const fetchVideos = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/videos`)
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos.sort((a: Video, b: Video) => a.order_index - b.order_index))
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    onVideoSelect?.(video)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <div className="w-32 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (selectedVideo) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedVideo(null)}>
            ← Volver a la lista
          </Button>
          {canEdit && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedVideo.title}
              <div className="flex items-center space-x-2">
                {selectedVideo.is_preview && (
                  <Badge variant="secondary">
                    <Eye className="h-3 w-3 mr-1" />
                    Vista Previa
                  </Badge>
                )}
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(selectedVideo.duration_seconds)}
                </Badge>
              </div>
            </CardTitle>
            {selectedVideo.description && <CardDescription>{selectedVideo.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <VideoPlayer
              src={selectedVideo.video_url}
              title={selectedVideo.title}
              onProgress={(currentTime, duration) => {
                // TODO: Save progress to database
                console.log("Progress:", currentTime, duration)
              }}
              onComplete={() => {
                // TODO: Mark video as completed
                console.log("Video completed")
              }}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Videos del Curso</h3>
        <Badge variant="outline">{videos.length} videos</Badge>
      </div>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No hay videos</h3>
            <p className="text-gray-500">
              {canEdit
                ? "Sube el primer video para comenzar con este curso."
                : "Este curso aún no tiene videos disponibles."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleVideoClick(video)}
            >
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <Play className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {index + 1}. {video.title}
                        </h4>
                        {video.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {video.is_preview ? (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Gratis
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(video.duration_seconds)}
                      </div>
                      {canEdit && (
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
