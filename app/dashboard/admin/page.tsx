// app/(dashboard)/admin/page.tsx

import { getSimpleSession } from "@/lib/getSimpleSession";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"; // <-- Importación necesaria
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, DollarSign, TrendingUp, AlertCircle, ArrowUpRight, Shield } from "lucide-react";
import Link from "next/link";

// Componente StatsCard (puedes borrar esto si ya lo importas correctamente)
function StatsCard({ title, value, icon: Icon, trend }: { title: string, value: string | number, icon: React.ElementType, trend?: { value: number, isPositive: boolean } }) {
  return (
    <Card className="border-gray-200 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="w-5 h-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowUpRight className={`w-4 h-4 mr-1 ${!trend.isPositive && 'rotate-180'}`} />
            <span className="font-medium">{trend.value}%</span>
            <span className="text-gray-500 ml-1">vs mes anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default async function AdminDashboardPage() {
  const { user: sessionUser, isLoggedIn } = await getSimpleSession();

  if (!isLoggedIn || !sessionUser) {
    redirect("/login/admin"); // Asegúrate que esta sea tu ruta de login de admin
  }
  if (sessionUser.role !== "admin") {
    const target = sessionUser.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student";
    redirect(target);
  }

  // ==========================================================
  // INICIO CORRECCIÓN: Inicialización correcta del cliente Supabase
  // ==========================================================
  const cookieStore = cookies(); // 1. Llama a cookies() aquí
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); // 2. Pasa la función
  // ==========================================================
  // FIN CORRECCIÓN
  // ==========================================================

  // --- OBTENCIÓN DE DATOS REALES ---
  const { count: userCount, error: userCountError } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true });

  const { count: courseCount, error: courseCountError } = await supabase
    .from('courses')
    .select('id', { count: 'exact', head: true });

  const { count: pendingInstructorsCount, error: pendingError } = await supabase
      .from('instructors')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

  const { data: recentUsersData, error: recentUsersError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(4);

  if (userCountError || courseCountError || pendingError || recentUsersError) {
       console.error("Error fetching admin dashboard data:",
         (userCountError || courseCountError || pendingError || recentUsersError)?.message
       );
  }

  // Prepara los datos
  const stats = {
      totalUsers: userCount ?? 0,
      totalCourses: courseCount ?? 0,
      pendingInstructors: pendingInstructorsCount ?? 0,
      monthlyRevenue: 0, // Placeholder
      userGrowth: 0, // Placeholder
      courseGrowth: 0, // Placeholder
      revenueGrowth: 0, // Placeholder
  };

  const recentUsers = (recentUsersData || []).map(u => ({
      id: u.id,
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
      email: u.email,
      role: u.role,
      status: 'active',
      joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
  }));

  const systemAlerts: any[] = [];
  if (stats.pendingInstructors > 0) {
      systemAlerts.push({ type: "warning", message: `${stats.pendingInstructors} nuevas solicitudes de instructor pendientes`, priority: "high" });
  }
  // --- FIN OBTENCIÓN DE DATOS REALES ---

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" />
      <div className="md:ml-64 pt-16">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
            <p className="text-gray-600">
              Bienvenido de vuelta, {sessionUser.name || "Admin"}.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Usuarios" value={stats.totalUsers.toLocaleString()} icon={Users} />
            <StatsCard title="Total Cursos" value={stats.totalCourses} icon={BookOpen} />
            <StatsCard title="Ingresos (Placeholder)" value={`$${stats.monthlyRevenue.toLocaleString()}`} icon={DollarSign} />
            <StatsCard title="Instructores Pendientes" value={stats.pendingInstructors} icon={Shield} />
          </div>

          {/* Grid principal */}
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
                    <Link href="/dashboard/admin/users">
                        <Button variant="outline" size="sm" className="text-sm bg-transparent">Ver Todos</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.length === 0 ? (
                      <p className="text-sm text-gray-500">No hay usuarios recientes.</p>
                    ) : (
                      recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                               <span className="text-white font-semibold text-sm">
                                 {user.name.split(" ").map((n: any[]) => n[0]).join("").slice(0,2).toUpperCase()}
                               </span>
                             </div>
                             <div>
                               <h3 className="font-semibold text-gray-900">{user.name}</h3>
                               <p className="text-sm text-gray-500">{user.email}</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${ user.role === "instructor" ? "bg-blue-100 text-blue-700" : user.role === "admin" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700" }`}>
                               {user.role}
                             </span>
                          </div>
                        </div>
                      ))
                    )}
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
                     {systemAlerts.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay alertas nuevas.</p>
                     ) : (
                         systemAlerts.map((alert: any, index: number) => ( // Tipado simple
                           <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                             <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                             <div className="flex-1">
                               <p className="text-sm text-gray-900 font-medium">{alert.message}</p>
                             </div>
                           </div>
                         ))
                     )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
