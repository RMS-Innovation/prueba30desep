import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Eye, Users } from "lucide-react"
import Link from "next/link"
import type { Course } from "@/lib/types/database"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url || "/placeholder.svg"}
            alt={course.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground">No thumbnail</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/instructor/courses/${course.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/instructor/courses/${course.id}/preview`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">{course.title}</h3>
          <Badge variant={course.is_published ? "default" : "secondary"}>
            {course.is_published ? "Published" : "Draft"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description || "No description"}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.total_enrollments || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">${course.price}</span>
          </div>
          {course.level && <Badge variant="outline">{course.level}</Badge>}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href={`/instructor/courses/${course.id}`}>Manage Course</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
