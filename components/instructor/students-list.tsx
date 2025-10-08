import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Eye } from "lucide-react"
import Link from "next/link"

interface Enrollment {
  id: string
  enrolled_at: string
  progress: number
  completed_at?: string
  student: {
    id: string
    first_name: string
    last_name: string
    profile_picture_url?: string
  }
  course: {
    id: string
    title: string
  }
}

interface StudentsListProps {
  enrollments: Enrollment[]
}

export function StudentsList({ enrollments }: StudentsListProps) {
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No students enrolled yet</p>
      </div>
    )
  }

  const getProgressStatus = (progress: number, completedAt?: string) => {
    if (completedAt) return { label: "Completed", variant: "default" as const }
    if (progress === 0) return { label: "Not Started", variant: "secondary" as const }
    if (progress < 100) return { label: "In Progress", variant: "outline" as const }
    return { label: "Completed", variant: "default" as const }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {enrollments.map((enrollment) => {
        const status = getProgressStatus(enrollment.progress, enrollment.completed_at)

        return (
          <div key={enrollment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-4 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={enrollment.student.profile_picture_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {enrollment.student.first_name[0]}
                  {enrollment.student.last_name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground">
                    {enrollment.student.first_name} {enrollment.student.last_name}
                  </p>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{enrollment.course.title}</p>
                <div className="flex items-center gap-3">
                  <Progress value={enrollment.progress} className="w-32" />
                  <span className="text-xs text-muted-foreground">{enrollment.progress.toFixed(0)}%</span>
                  <span className="text-xs text-muted-foreground">Enrolled {formatDate(enrollment.enrolled_at)}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/instructor/students/${enrollment.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
