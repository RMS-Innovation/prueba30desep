import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Video, Award, Plus, Eye, Edit } from "lucide-react"

export default async function InstructorDashboard() {
  const session = await getSession()

  if (!session?.user || session.user.role !== "instructor") {
    redirect("/auth/login")
  }

  // Mock data - replace with real data from database
  const stats = {
    totalCourses: 6,
    totalStudents: 142,
    totalVideos: 48,
    certificatesIssued: 89,
  }

  const recentCourses = [
    {
      id: 1,
      title: "Anatomía Dental Avanzada",
      students: 28,
      completion: 85,
      status: "active",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      title: "Técnicas de Endodoncia",
      students: 35,
      completion: 72,
      status: "active",
      lastUpdated: "2024-01-12",
    },
    {
      id: 3,
      title: "Prostodoncia Digital",
      students: 22,
      completion: 95,
      status: "completed",
      lastUpdated: "2024-01-10",
    },
  ]

  const recentActivity = [
    {
      type: "enrollment",
      message: '3 nuevos estudiantes se inscribieron en "Anatomía Dental Avanzada"',
      time: "2 horas",
    },
    { type: "completion", message: 'María García completó "Prostodoncia Digital"', time: "4 horas" },
    { type: "review", message: "5 tareas pendientes de revisión", time: "6 horas" },
    { type: "certificate", message: "Se emitieron 2 nuevos certificados", time: "1 día" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="instructor" />

      <div className="md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Buenos días, Dr. {session.user.name}</h1>
              <p className="text-gray-600">
                28 estudiantes están actualmente inscritos en tu curso "Anatomía Dental Avanzada"
              </p>
            </div>
            <Button className="bg-purple-800 hover:bg-purple-900">
              <Plus className="w-4 h-4 mr-2" />
              Crear Curso
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Cursos"
              value={stats.totalCourses}
              icon={BookOpen}
              trend={{ value: 20, isPositive: true }}
            />
            <StatsCard
              title="Total Estudiantes"
              value={stats.totalStudents}
              icon={Users}
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard
              title="Videos Subidos"
              value={stats.totalVideos}
              icon={Video}
              trend={{ value: 25, isPositive: true }}
            />
            <StatsCard
              title="Certificados Emitidos"
              value={stats.certificatesIssued}
              icon={Award}
              trend={{ value: 30, isPositive: true }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Courses */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Mis Cursos
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Todos
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                course.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {course.status === "active" ? "Activo" : "Completado"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span>{course.students} estudiantes</span>
                            <span>{course.completion}% completado</span>
                            <span>Actualizado {course.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">Hace {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
