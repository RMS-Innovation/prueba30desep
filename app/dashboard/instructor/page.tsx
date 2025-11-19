// app/(dashboard)/instructor/page.tsx

import { getSimpleSession } from "@/lib/getSimpleSession";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Video, Award, Plus, Eye, Edit } from "lucide-react";
import Link from "next/link"; // Asegúrate de importar Link

export default async function InstructorDashboard() {
  const { user: sessionUser, isLoggedIn } = await getSimpleSession();

  if (!isLoggedIn || !sessionUser) {
    redirect("/auth/login");
  }

  if (sessionUser.role !== "instructor") {
    redirect("/dashboard/student"); // Si no es instructor, lo mandamos a student
  }

  // --- INICIO DE LA OBTENCIÓN DE DATOS REALES ---
  const supabase = createServerComponentClient({ cookies });

  // 1. Obtener el perfil del instructor para las estadísticas
  const { data: instructorProfile } = await supabase
    .from('instructors')
    .select('id, total_courses_created, total_students_taught, total_reviews, total_earnings')
    .eq('user_id', sessionUser.id)
    .single();

  // 2. Obtener los cursos recientes del instructor
  const { data: recentCoursesData } = await supabase
    .from('courses')
    .select('id, title, total_enrollments, is_published, last_updated_content')
    .eq('instructor_id', instructorProfile?.id) // Usamos el ID del perfil de instructor
    .order('created_at', { ascending: false })
    .limit(3);

  // --- FIN DE LA OBTENCIÓN DE DATOS REALES ---

  // Usamos los datos reales en lugar de los datos de prueba (mock)
  const stats = {
    totalCourses: instructorProfile?.total_courses_created ?? 0,
    totalStudents: instructorProfile?.total_students_taught ?? 0,
    totalReviews: instructorProfile?.total_reviews ?? 0,
    totalEarnings: instructorProfile?.total_earnings ?? 0,
  };

  const recentCourses = recentCoursesData || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="instructor" />
      <div className="md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Buenos días, Dr. {sessionUser.name}</h1>
              <p className="text-gray-600">Aquí tienes un resumen de tu actividad.</p>
            </div>
            <Link href="/instructor/courses/new">
              <Button className="bg-purple-800 hover:bg-purple-900">
                <Plus className="w-4 h-4 mr-2" />
                Crear Curso
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Cursos" value={stats.totalCourses} icon={BookOpen} />
            <StatsCard title="Total Estudiantes" value={stats.totalStudents} icon={Users} />
            <StatsCard title="Total Reseñas" value={stats.totalReviews} icon={Award} />
            <StatsCard title="Ganancias Totales" value={`$${stats.totalEarnings.toFixed(2)}`} icon={Video} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Courses */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Mis Cursos Recientes
                    </div>
                    <Link href="/instructor/courses">
                      <Button variant="outline" size="sm">Ver Todos</Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCourses.length === 0 ? (
                      <p className="text-sm text-gray-500">Aún no has creado ningún curso.</p>
                    ) : (
                      recentCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <span>{course.total_enrollments} estudiantes</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${course.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                {course.is_published ? "Publicado" : "Borrador"}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Link href={`/courses/${course.id}`}>
                              <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1" /> Ver</Button>
                            </Link>
                            <Link href={`/instructor/courses/${course.id}`}>
                               <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-1" /> Editar</Button>
                            </Link>
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
