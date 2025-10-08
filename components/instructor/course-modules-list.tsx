"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, Video } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface Module {
  id: string
  title: string
  description?: string
  order_index: number
  videos?: any[]
}

interface CourseModulesListProps {
  courseId: string
  modules: Module[]
}

export function CourseModulesList({ courseId, modules }: CourseModulesListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No modules yet. Add your first module to get started.</p>
        <Button asChild>
          <Link href={`/instructor/courses/${courseId}/modules/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const isExpanded = expandedModules.has(module.id)
        const videoCount = module.videos?.[0]?.count || 0

        return (
          <Card key={module.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Module {index + 1}</span>
                    <h3 className="font-semibold text-foreground">{module.title}</h3>
                  </div>
                  {module.description && <p className="text-sm text-muted-foreground">{module.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{videoCount} videos</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/instructor/courses/${courseId}/modules/${module.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleModule(module.id)}>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-foreground">Videos</h4>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/instructor/courses/${courseId}/modules/${module.id}/videos/new`}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Video
                      </Link>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Video management coming soon...</p>
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
