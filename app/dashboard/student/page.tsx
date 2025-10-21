// app/(dashboard)/student/page.tsx
import { headers, cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getSimpleSession } from "@/lib/simple-auth"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ProgressRing } from "@/components/dashboard/progress-ring"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Play,
  CheckCircle,
} from "lucide-react"

// Si no tienes este componente, puedes quitarlo o reemplazarlo por un <div/>
// import { StudentAvatar } from "@/components/ui/student-avatar"

type RecentCourse = {
  id: string
  courses?: {
    id: string
    title: string
    thumbnail?: string | null
    instructor_name?: string | null
  }
  progress?: Array<{
    completed_lessons?: number
    total_lessons?: number
    progress_percentage?: number
  }>
}

type StudentStatsResponse = {
  user: { name: string | null; email: string | null; profilePicture: string | null } | null
  stats: {
    enrolledCourses: number
    completedCourses: number
    certificates: number
    studyTimeHours: number
  }
  recentCourses: RecentCourse[]
  averageProgress: number
}

async function getStudentData(): Promise<StudentStatsResponse> {
  // Construye URL absoluta (soporta dev y Vercel)
  const h = headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const protocol = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http")
  if (!host) {
    // fallback muy defensivo
    throw new Error("No host header found to build absolute URL")
  }
  const baseURL = `${protocol}://${host}`

  const cookieHeader = cookies().toString()

  const res = await fetch(`${baseURL}/api/student/stats`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  })

  if (!res.ok) {
    // Evita romper el render si el API está caído
    return {
      user: { name: null, email: null, profilePicture: null },
      stats: { enrolledCourses: 0, completedCourses: 0, certificates: 0, studyTimeHours: 0 },
      recentCourses: [],
      averageProgress: 0,
    }
  }

  return res.json()
}

export default async function StudentDashboardPage() {
  const session = await getSimpleSession()

  // Requiere sesión
  if (!session?.user) redirect("/auth/login")

  // Si el usuario no es student, mandamos al dashboard que le corresponda
  if (session.user.role !== "student") {
    const target = session.user.role === "instructor" ? "/dashboard/instructor" : "/dashboard/admin"
    redirect(target)
  }

  const { user, stats, recentCourses, averageProgress } = await getStudentData()

  const nextCertificateCourse = recentCourses.find((course) => {
    const p = course.progress?.[0]
    return p && (p.progress_percentage ?? 0) > 0 && (p.progress_percentage ?? 0) < 100
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar con rol real */}
      <Sidebar userRole={session.user.role} />

      <div className="md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              {/* Si no tienes StudentAvatar, usa un placeholder */}
              {/* <StudentAvatar size="lg" /> */}
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                {(user?.name ?? session.user.name ?? "E")
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ¡Bienvenido de vuelta, {user?.name || session.user.name || "Estudiante"}!
                </h1>
                {nextCertificateCourse && (
                  <p className="text-gray-600">
                    Estás al {nextCertificateCourse.progress?.[0]?.progress_percentage || 0}% de completar{" "}
                    ‘{nextCertificateCourse.courses?.title}’. ¡Ánimo!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Cursos Inscritos"
              value={stats.enrolledCourses}
              icon={BookOpen}
              trend={{ value: 25, isPositive: true }}
            />
            <StatsCard
              title="Cursos Completados"
              value={stats.completedCourses}
              icon={CheckCircle}
              trend={{ value: 100, isPositive: true }}
            />
            <StatsCard
              title="Certificados"
              value={stats.certificates}
              icon={Award}
              trend={{ value: 100, isPositive: true }}
            />
            <StatsCard
              title="Horas de Estudio"
              value={`${stats.studyTimeHours}h`}
              icon={Clock}
              trend={{ value: 15, isPositive: true }}
            />
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cursos recientes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Mis Cursos Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCourses.length === 0 && (
                      <div className="text-sm text-gray-600">Todavía no tienes cursos recientes.</div>
                    )}

                    {recentCourses.map((course) => {
                      const c = course.courses
                      const p = course.progress?.[0]
                      const progress = p?.progress_percentage ?? 0
                      const completedLessons = p?.completed_lessons ?? 0
                      const totalLessons = p?.total_lessons ?? 0

                      return (
                        <div
                          key={course.id}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={c?.thumbnail || "/placeholder.svg"}
                            alt={c?.title || "Curso"}
                            className="w-20 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{c?.title}</h3>
                            <p className="text-sm text-gray-600">Por {c?.instructor_name || "Instructor"}</p>
                            <div className="flex items-center mt-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">
                                {completedLessons}/{totalLessons} lecciones
                              </span>
                            </div>
                          </div>
                          <Link href={`/dashboard/student/course/${c?.id}`}>
                            <Button size="sm" className="bg-purple-800 hover:bg-purple-900">
                              {progress === 100 ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Ver Curso
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-1" />
                                  Continuar
                                </>
                              )}
                            </Button>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Aside */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Progreso General
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <ProgressRing progress={averageProgress} />
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Progreso promedio en todos tus cursos
                  </p>
                </CardContent>
              </Card>

              {nextCertificateCourse && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Próximo Certificado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-8 h-8 text-purple-800" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {nextCertificateCourse.courses?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {(nextCertificateCourse.progress?.[0]?.total_lessons || 0) -
                          (nextCertificateCourse.progress?.[0]?.completed_lessons || 0)}{" "}
                        módulos restantes
                      </p>
                      <Link href={`/dashboard/student/course/${nextCertificateCourse.courses?.id}`}>
                        <Button className="w-full bg-purple-800 hover:bg-purple-900">
                          Continuar Curso
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
