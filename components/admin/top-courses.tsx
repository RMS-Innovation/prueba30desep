import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface Course {
  id: string
  title: string
  instructor: string
  enrollments: number
  revenue: number
  rating: number
}

interface TopCoursesProps {
  courses: Course[]
}

export function TopCourses({ courses }: TopCoursesProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Top Performing Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-sm font-medium">{course.enrollments} students</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {course.rating.toFixed(1)}
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono">
                  ${course.revenue.toLocaleString()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
