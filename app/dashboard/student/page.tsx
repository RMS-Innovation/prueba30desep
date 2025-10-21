// app/(dashboard)/student/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getSimpleSession, User } from "@/lib/simple-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Clock, TrendingUp, Play, CheckCircle } from "lucide-react";

type EnrollmentWithDetails = {
  id: string;
  progress_percentage: number | null;
  courses: {
    id: string;
    title: string | null;
    thumbnail_url: string | null;
    instructor_name: string | null;
  } | null;
};

export default async function StudentDashboardPage() {
  const { user: sessionUser, isLoggedIn } = await getSimpleSession();

  if (!isLoggedIn || !sessionUser) {
    redirect("/auth/login");
  }
  if (!sessionUser.role || sessionUser.role !== "student") {
    const target = sessionUser.role === "instructor" ? "/dashboard/instructor" : "/auth/login";
    redirect(target);
  }

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  let studentProfile = null;
  let recentEnrollmentsData = null;
  let profileError = null;
  let enrollmentsError = null;

  try {
    const { data: spData, error: pError } = await supabase
      .from('students')
      .select('id, total_courses_completed, total_hours_learned, certificates_earned')
      .eq('user_id', sessionUser.id)
      .maybeSingle();
      studentProfile = spData;
      profileError = pError;

    const studentIdentifier = studentProfile?.id ?? sessionUser.id;
    const { data: reData, error: eError } = await supabase
      .from('enrollments')
      .select(`id, progress_percentage, courses ( id, title, thumbnail_url, instructor_name )`)
      .eq('student_id', studentIdentifier)
      .order('last_accessed_at', { ascending: false, nullsFirst: false })
      .limit(3)
      .returns<EnrollmentWithDetails[]>();
      recentEnrollmentsData = reData;
      enrollmentsError = eError;

  } catch (dbError: any) {
      console.error("Database query error in StudentDashboardPage:", dbError?.message);
  }

  if (profileError || enrollmentsError) {
    console.error("Error fetching student dashboard data:", (profileError as any)?.message || (enrollmentsError as any)?.message);
  }

  const recentEnrollments = recentEnrollmentsData || [];
  const stats = {
    enrolledCourses: recentEnrollments.length,
    completedCourses: studentProfile?.total_courses_completed ?? 0,
    certificates: studentProfile?.certificates_earned ?? 0,
    studyTimeHours: Math.round((studentProfile?.total_hours_learned ?? 0) / 60),
  };
  const averageProgress = recentEnrollments.length > 0
    ? Math.round(recentEnrollments.reduce((sum, enrollment) => sum + (enrollment.progress_percentage ?? 0), 0) / recentEnrollments.length)
    : 0;
  const nextCertificateCourse = recentEnrollments.find((enrollment) => {
     const progress = enrollment.progress_percentage ?? 0;
     return progress > 0 && progress < 100;
  });
  const userName = sessionUser.name || sessionUser.firstName || "Estudiante";
  const userInitials = (userName.split(" ").map((s) => s[0]).join("").slice(0, 2)).toUpperCase() || "E";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={sessionUser.role as 'student' | 'instructor' | 'admin'} />
      <div className="md:ml-64 pt-16">
        <div className="p-6">
          {/* Header Interno */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                {userInitials}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ¡Bienvenido de vuelta, {userName}!
                </h1>
                {nextCertificateCourse?.courses && (
                   <p className="text-gray-600">
                     Estás al {nextCertificateCourse.progress_percentage || 0}% de completar{' '}
                     ‘{nextCertificateCourse.courses.title}’. ¡Ánimo!
                   </p>
                 )}
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
                    {/* ========================================================== */}
                    {/* CORRECCIÓN: Se reemplazó el comentario por el div real */}
                    {/* ========================================================== */}
                     {recentEnrollments.length === 0 && (
                         <div className="text-sm text-gray-600">Todavía no tienes cursos recientes.</div>
                     )}
                     {recentEnrollments.map((enrollment) => {
                         const course = enrollment.courses;
                         const progress = enrollment.progress_percentage ?? 0;
                         if (!course) return null;
                         const instructorName = course.instructor_name || "Instructor";
                         
                         return (
                           <div key={enrollment.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                             <img src={course.thumbnail_url || "/placeholder.svg"} alt={course.title || "Curso"} className="w-20 h-12 object-cover rounded"/>
                             <div className="flex-1">
                               <h3 className="font-semibold">{course.title}</h3>
                               <p className="text-sm text-gray-600">Por {instructorName}</p>
                               <div className="flex items-center mt-2">
                                 <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                   <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progress}%` }}/>
                                 </div>
                                 <span className="text-sm text-gray-600">{progress}% Completo</span>
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
                {/* ========================================================== */}
                {/* CORRECCIÓN: Se reemplazó el comentario por el contenido real del Card */}
                {/* ========================================================== */}
                {nextCertificateCourse?.courses && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center"><Award className="w-5 h-5 mr-2" /> Próximo Certificado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Award className="w-8 h-8 text-purple-800" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {nextCertificateCourse.courses.title}
                        </h3>
                         <Link href={`/dashboard/student/course/${nextCertificateCourse.courses.id}`}>
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
  );
}