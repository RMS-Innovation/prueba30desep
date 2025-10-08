import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, CreditCard, TrendingUp, AlertCircle } from "lucide-react"

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login")
  }

  // Mock data - replace with real data from database
  const stats = {
    totalUsers: 1247,
    totalCourses: 45,
    monthlyRevenue: 24680,
    platformUptime: 99.8,
  }

  const recentUsers = [
    { name: "Dr. Ana García", email: "ana@email.com", role: "instructor", status: "pending", joinDate: "2024-01-15" },
    { name: "Carlos Ruiz", email: "carlos@email.com", role: "student", status: "active", joinDate: "2024-01-14" },
    { name: "María López", email: "maria@email.com", role: "student", status: "active", joinDate: "2024-01-13" },
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
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
            <p className="text-gray-600">Esta semana: 142 nuevas inscripciones, $12,480 en pagos procesados</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Usuarios"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Total Cursos"
              value={stats.totalCourses}
              icon={BookOpen}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Ingresos Mensuales"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              icon={CreditCard}
              trend={{ value: 18, isPositive: true }}
            />
            <StatsCard
              title="Uptime Plataforma"
              value={`${stats.platformUptime}%`}
              icon={TrendingUp}
              trend={{ value: 0.2, isPositive: true }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Users */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Usuarios Recientes
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Todos
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-800 font-semibold">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "instructor" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role === "instructor" ? "Instructor" : "Estudiante"}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status === "active" ? "Activo" : "Pendiente"}
                          </span>
                          <span className="text-sm text-gray-500">{user.joinDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Alerts */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Alertas del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemAlerts.map((alert, index) => (
                      <div key={index} className="flex items-start space-x-3">
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
                          <p className="text-sm text-gray-900">{alert.message}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                              alert.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : alert.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {alert.priority === "high" ? "Alta" : alert.priority === "medium" ? "Media" : "Baja"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-purple-800 hover:bg-purple-900">Ver Todas las Alertas</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
