// app/(dashboard)/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { getSimpleSession } from "@/lib/getSimpleSession";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Clock, TrendingUp, Play, CheckCircle } from "lucide-react";

// ==================================================================
// INICIO CORRECCIÓN: Definimos un tipo para los datos que SÍ vienen de Supabase
// ==================================================================
type EnrollmentWithDetails = {
  id: string; // ID de la inscripción (enrollment)
  progress_percentage: number | null;
  courses: { // Datos del curso anidados
    id: string;
    title: string | null;
    thumbnail_url: string | null; // Nombre original de la columna
    instructor_name: string | null; // Asegúrate que este exista o ajústalo
  } | null; // El curso podría ser null si hay un error en el JOIN
  // video_progress: any[]; // Puedes tipar esto mejor si lo necesitas
};
// ==================================================================
// FIN CORRECCIÓN
// ==================================================================


export default async function StudentDashboardPage() {
  const { user: sessionUser, isLoggedIn } = await getSimpleSession();

  if (!isLoggedIn || !sessionUser) {
    redirect("/auth/login");
  }

  if (sessionUser.role !== "student") {
    const target = sessionUser.role === "instructor" ? "/dashboard/instructor" : "/dashboard/admin";
    redirect(target);
  }

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Busca el perfil extendido del estudiante
  const { data: studentProfile, error: profileError } = await supabase
    .from('students')
    .select('total_courses_completed, total_hours_learned, certificates_earned')
    .eq('user_id', sessionUser.id)
    //.single();
    .maybeSingle();

   // Busca cursos recientes (inscripciones)
  const { data: recentEnrollmentsData, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select(`
      id,
      progress_percentage,
      courses ( id, title, thumbnail_url, instructor_name )
    `)
    .eq('student_id', sessionUser.id) // ¡IMPORTANTE! Asume que student_id es el user_id de auth. Cambia si es el id de la tabla students.
    .order('last_accessed_at', { ascending: false, nullsFirst: false }) // Ordena y maneja nulos si es necesario
    .limit(3)
    .returns<EnrollmentWithDetails[]>(); // <-- Le decimos a Supabase qué tipo esperar

  if (profileError || enrollmentsError) {
    //console.error("Error fetching student data:", profileError || enrollmentsError);
    console.error("Error fetching student data:", (profileError || enrollmentsError)?.message);
  }

  // Usamos los datos correctos ahora
  const recentEnrollments = recentEnrollmentsData || [];

  const stats = {
    enrolledCourses: recentEnrollments.length, // O un count real si lo prefieres
    completedCourses: studentProfile?.total_courses_completed ?? 0,
    certificates: studentProfile?.certificates_earned ?? 0,
    studyTimeHours: Math.round((studentProfile?.total_hours_learned ?? 0) / 60),
  };

  // ==================================================================
  // INICIO CORRECCIÓN: Usamos la nueva estructura para calcular averageProgress
  // ==================================================================
  const averageProgress = recentEnrollments.length > 0
    ? recentEnrollments.reduce((sum, enrollment) => sum + (enrollment.progress_percentage ?? 0), 0) / recentEnrollments.length
    : 0;
  // ==================================================================
  // FIN CORRECCIÓN
  // ==================================================================

  // ==================================================================
  // INICIO CORRECCIÓN: Usamos la nueva estructura para encontrar nextCertificateCourse
  // ==================================================================
  const nextCertificateCourse = recentEnrollments.find((enrollment) => {
     const progress = enrollment.progress_percentage ?? 0;
     return progress > 0 && progress < 100;
  });
  // ==================================================================
  // FIN CORRECCIÓN
  // ==================================================================


  const userName = sessionUser.name || sessionUser.firstName || "Estudiante";
  const userInitials = (userName.split(" ").map((s) => s[0]).join("").slice(0, 2)) || "E";


  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={sessionUser.role as 'student' | 'instructor' | 'admin'} />
      <div className="md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                {userInitials}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ¡Bienvenido de vuelta, {userName}!
                </h1>
                {/* ================================================================== */}
                {/* INICIO CORRECCIÓN: Usamos la nueva estructura aquí también */}
                {/* ================================================================== */}
                {nextCertificateCourse && nextCertificateCourse.courses && (
                   <p className="text-gray-600">
                     Estás al {nextCertificateCourse.progress_percentage || 0}% de completar{' '}
                     ‘{nextCertificateCourse.courses.title}’. ¡Ánimo!
                   </p>
                 )}
                 {/* ================================================================== */}
                 {/* FIN CORRECCIÓN */}
                 {/* ================================================================== */}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <StatsCard title="Cursos Inscritos" value={stats.enrolledCourses} icon={BookOpen} />
             <StatsCard title="Cursos Completados" value={stats.completedCourses} icon={CheckCircle} />
             <StatsCard title="Certificados" value={stats.certificates} icon={Award} />
             <StatsCard title="Horas de Estudio" value={`${stats.studyTimeHours}h`} icon={Clock} />
           </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Cursos recientes */}
             <div className="lg:col-span-2">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center">
                     <BookOpen className="w-5 h-5 mr-2" /> Mis Cursos Recientes
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     {recentEnrollments.length === 0 && (
                         <div className="text-sm text-gray-600">Todavía no tienes cursos recientes.</div>
                     )}
                     {/* ================================================================== */}
                     {/* INICIO CORRECCIÓN: Usamos la nueva estructura en el map */}
                     {/* ================================================================== */}
                     {recentEnrollments.map((enrollment) => {
                         const course = enrollment.courses; // Objeto del curso anidado
                         const progress = enrollment.progress_percentage ?? 0; // Porcentaje directamente

                         // Si no hay datos del curso (error en JOIN?), no lo mostramos
                         if (!course) return null;

                         return (
                           <div key={enrollment.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                             <img src={course.thumbnail_url || "/placeholder.svg"} alt={course.title || "Curso"} className="w-20 h-12 object-cover rounded"/>
                             <div className="flex-1">
                               <h3 className="font-semibold">{course.title}</h3>
                               <p className="text-sm text-gray-600">Por {course.instructor_name || "Instructor"}</p>
                               <div className="flex items-center mt-2">
                                 <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                   <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progress}%` }}/>
                                 </div>
                                 <span className="text-sm text-gray-600">
                                     {progress}% Completo
                                     {/* Podrías añadir lógica para lecciones si obtienes esos datos */}
                                 </span>
                               </div>
                             </div>
                             <Link href={`/dashboard/student/course/${course.id}`}>
                               <Button size="sm" className="bg-purple-800 hover:bg-purple-900">
                                 {progress === 100 ? (<CheckCircle className="w-4 h-4 mr-1" />) : (<Play className="w-4 h-4 mr-1" />)}
                                 {progress === 100 ? "Ver Curso" : "Continuar"}
                               </Button>
                             </Link>
                           </div>
                         );
                     })}
                     {/* ================================================================== */}
                     {/* FIN CORRECCIÓN */}
                     {/* ================================================================== */}
                   </div>
                 </CardContent>
               </Card>
             </div>
             {/* Aside */}
             <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><TrendingUp className="w-5 h-5 mr-2"/> Progreso General</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center">
                      <ProgressRing progress={averageProgress} />
                      <p className="text-sm text-gray-600 mt-4 text-center">Progreso promedio</p>
                  </CardContent>
                </Card>
                {/* ================================================================== */}
                {/* INICIO CORRECCIÓN: Usamos la nueva estructura aquí */}
                {/* ================================================================== */}
                {nextCertificateCourse && nextCertificateCourse.courses && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2" /> Próximo Certificado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        {/* ... (Icono y otros elementos visuales) ... */}
                        <h3 className="font-semibold text-gray-900 mb-1">
                           {nextCertificateCourse.courses.title}
                        </h3>
                        {/* Necesitarías obtener el total/completado de lecciones si quieres mostrar módulos restantes */}
                         {/* <p className="text-sm text-gray-600 mb-3">X módulos restantes</p> */}
                         <Link href={`/dashboard/student/course/${nextCertificateCourse.courses.id}`}>
                           <Button className="w-full bg-purple-800 hover:bg-purple-900">
                             Continuar Curso
                           </Button>
                         </Link>
                       </div>
                    </CardContent>
                  </Card>
                )}
                {/* ================================================================== */}
                {/* FIN CORRECCIÓN */}
                {/* ================================================================== */}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
