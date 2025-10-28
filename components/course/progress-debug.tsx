"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCourseProgress } from "@/lib/progress-tracker"
import { CheckCircle2, XCircle } from "lucide-react"

interface ProgressDebugProps {
  courseId: number
  modules: Array<{
    id: number
    title: string
    content: Array<{
      id: number
      type: "video" | "quiz"
      title: string
    }>
  }>
}

export function ProgressDebug({ courseId, modules }: ProgressDebugProps) {
  const progress = getCourseProgress(courseId)

  if (!progress) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-sm">Debug: Estado del Progreso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">No hay progreso guardado para este curso.</p>
        </CardContent>
      </Card>
    )
  }

  const allContent = modules.flatMap((m) => m.content)
  const totalItems = allContent.length
  const completedVideos = Object.values(progress.videoProgress).filter((v) => v.completed).length
  const completedQuizzes = Object.values(progress.quizProgress).filter((q) => q.completed).length
  const totalCompleted = completedVideos + completedQuizzes

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          Debug: Estado del Progreso
          <Badge variant="secondary">
            {totalCompleted}/{totalItems} completados
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">Videos:</p>
          {allContent
            .filter((item) => item.type === "video")
            .map((item) => {
              const videoProgress = progress.videoProgress[item.id]
              return (
                <div key={`video-${item.id}`} className="flex items-center gap-2 text-xs">
                  {videoProgress?.completed ? (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-gray-400" />
                  )}
                  <span className="flex-1 truncate">{item.title}</span>
                  {videoProgress && (
                    <span className="text-gray-500">
                      {Math.round((videoProgress.lastPosition / videoProgress.totalSeconds) * 100)}%
                    </span>
                  )}
                </div>
              )
            })}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">Cuestionarios:</p>
          {allContent
            .filter((item) => item.type === "quiz")
            .map((item) => {
              const quizProgress = progress.quizProgress[item.id]
              return (
                <div key={`quiz-${item.id}`} className="flex items-center gap-2 text-xs">
                  {quizProgress?.completed ? (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-gray-400" />
                  )}
                  <span className="flex-1 truncate">{item.title}</span>
                  {quizProgress && (
                    <span className="text-gray-500">
                      {quizProgress.score}/{quizProgress.totalQuestions}
                    </span>
                  )}
                </div>
              )
            })}
        </div>

        <div className="pt-2 border-t border-blue-200">
          <p className="text-xs text-gray-600">
            Abre la consola del navegador (F12) para ver logs detallados de completado.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
