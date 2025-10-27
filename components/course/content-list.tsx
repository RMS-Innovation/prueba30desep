"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Lock, PlayCircle, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ContentItem {
  id: number
  type: "video" | "quiz"
  title: string
  duration?: string
  questionCount?: number
  completed: boolean
  locked: boolean
}

interface Module {
  id: number
  title: string
  content: ContentItem[]
}

interface ContentListProps {
  modules: Module[]
  currentContentId: number
  currentContentType: "video" | "quiz"
  onContentSelect: (contentId: number, contentType: "video" | "quiz") => void
}

export function ContentList({ modules, currentContentId, currentContentType, onContentSelect }: ContentListProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Contenido del Curso</h3>
      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900">{module.title}</h4>
            <div className="space-y-1">
              {module.content.map((item) => {
                const isCurrent = currentContentId === item.id && currentContentType === item.type

                return (
                  <Button
                    key={`${item.type}-${item.id}`}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left h-auto py-3 px-3",
                      isCurrent && "bg-purple-50 text-purple-900",
                      item.locked && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => !item.locked && onContentSelect(item.id, item.type)}
                    disabled={item.locked}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="mt-0.5">
                        {item.locked ? (
                          <Lock className="h-4 w-4 text-gray-400" />
                        ) : item.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : isCurrent ? (
                          item.type === "video" ? (
                            <PlayCircle className="h-4 w-4 text-purple-600" />
                          ) : (
                            <FileQuestion className="h-4 w-4 text-purple-600" />
                          )
                        ) : item.type === "video" ? (
                          <Circle className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FileQuestion className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.type === "video" ? item.duration : `${item.questionCount} preguntas`}
                        </p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
