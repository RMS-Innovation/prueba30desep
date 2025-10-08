import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Enrollment {
  id: string
  student: {
    first_name: string
    last_name: string
    profile_picture_url?: string
  }
  course: {
    title: string
  }
  enrolled_at: string
  progress: number
}

interface RecentEnrollmentsProps {
  enrollments: Enrollment[]
}

export function RecentEnrollments({ enrollments }: RecentEnrollmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Enrollments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent enrollments</p>
          ) : (
            enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={enrollment.student.profile_picture_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {enrollment.student.first_name[0]}
                      {enrollment.student.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {enrollment.student.first_name} {enrollment.student.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{enrollment.course.title}</p>
                  </div>
                </div>
                <Badge variant="secondary">{enrollment.progress}% Complete</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
