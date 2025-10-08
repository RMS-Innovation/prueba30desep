import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Calendar, Award } from "lucide-react"
import Link from "next/link"
import { StudentVideoProgress } from "@/components/instructor/student-video-progress"

export default async function StudentDetailPage({ params }: { params: { enrollmentId: string } }) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: instructor } = await supabase.from("instructors").select("*").eq("user_id", user.id).single()

  if (!instructor) {
    redirect("/login")
  }

  // Get enrollment details
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      enrolled_at,
      progress,
      completed_at,
      student:students(
        id,
        first_name,
        last_name,
        profile_picture_url,
        user:users(email)
      ),
      course:courses!inner(
        id,
        title,
        description,
        instructor_id
      )
    `,
    )
    .eq("id", params.enrollmentId)
    .single()

  if (!enrollment || (enrollment.course as any).instructor_id !== instructor.id) {
    redirect("/instructor/students")
  }

  // Get video progress
  const { data: videoProgress } = await supabase
    .from("video_progress")
    .select(
      `
      id,
      watched_duration,
      is_completed,
      last_watched_at,
      video:videos(
        id,
        title,
        duration,
        module:modules(
          id,
          title
        )
      )
    `,
    )
    .eq("enrollment_id", params.enrollmentId)
    .order("last_watched_at", { ascending: false })

  const student = enrollment.student as any
  const course = enrollment.course as any

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/instructor/students">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Link>
          </Button>

          {/* Student Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={student.profile_picture_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {student.first_name[0]}
                    {student.last_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {student.first_name} {student.last_name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {student.user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Enrolled {formatDate(enrollment.enrolled_at)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Course Progress</span>
                        <span className="text-sm font-semibold text-foreground">{enrollment.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={enrollment.progress} />
                    </div>
                    {enrollment.completed_at && (
                      <Badge className="gap-1">
                        <Award className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enrolled Course</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>

          {/* Video Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Video Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentVideoProgress videoProgress={videoProgress || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
