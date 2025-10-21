import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, DollarSign, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react"

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login/admin")
  }

  // Mock data - replace with real data from database
  const stats = {
    totalUsers: 1247,
    totalCourses: 45,
    monthlyRevenue: 24680,
    platformUptime: 99.8,
    userGrowth: 12.5,
    courseGrowth: 8.3,
    revenueGrowth: 18.2,
    uptimeChange: 0.2,
  }

  const recentUsers = [
    { name: "Dr. Ana García", email: "ana@email.com", role: "instructor", status: "pending", joinDate: "2024-01-15" },
    { name: "Carlos Ruiz", email: "carlos@email.com", role: "student", status: "active", joinDate: "2024-01-14" },
    { name: "María López", email: "maria@email.com", role: "student", status: "active", joinDate: "2024-01-13" },
    {
      name: "Dr. Pedro Sánchez",
      email: "pedro@email.com",
      role: "instructor",
      status: "active",
      joinDate: "2024-01-12",
    },
  ]

  const systemAlerts = [
    { type: "warning", message: "3 nuevas aplicaciones de instructor pendientes", priority: "high" },
    { type: "info", message: "Actualización de sistema programada para mañana", priority: "medium" },
    { type: "success", message: "Backup completado exitosamente", priority: "low" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" />

      <div className="md:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
            <p className="text-gray-600">
              Bienvenido de vuelta, {session.user.name}. Aquí está el resumen de tu plataforma.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Usuarios</CardTitle>
                <Users className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">{stats.userGrowth}%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Cursos</CardTitle>
                <BookOpen className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalCourses}</div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">{stats.courseGrowth}%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ingresos Mensuales</CardTitle>
                <DollarSign className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">{stats.revenueGrowth}%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Uptime Plataforma</CardTitle>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.platformUptime}%</div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">{stats.uptimeChange}%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Users */}
            <div className="lg:col-span-2">
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <Users className="w-5 h-5 mr-2 text-gray-600" />
                      Usuarios Recientes
                    </CardTitle>
                    <Button variant="outline" size="sm" className="text-sm bg-transparent">
                      Ver Todos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              user.role === "instructor" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.role === "instructor" ? "Instructor" : "Estudiante"}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              user.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.status === "active" ? "Activo" : "Pendiente"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Alerts */}
            <div>
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                    <AlertCircle className="w-5 h-5 mr-2 text-gray-600" />
                    Alertas del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemAlerts.map((alert, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            alert.type === "warning"
                              ? "bg-yellow-500"
                              : alert.type === "success"
                                ? "bg-green-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">{alert.message}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full mt-2 inline-block font-medium ${
                              alert.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : alert.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {alert.priority === "high" ? "Alta" : alert.priority === "medium" ? "Media" : "Baja"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">Ver Todas las Alertas</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
