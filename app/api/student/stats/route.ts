// app/api/student/stats/route.ts
import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { getSimpleSession } from "@/lib/getSimpleSession"

function getAuth0IdFromSession(session: any): string | null {
  return (
    session?.user?.auth0_id ??
    session?.user?.sub ??
    session?.user?.id ??
    null
  )
}

export async function GET() {
  try {
    const session = await getSimpleSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (session.user.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const auth0Id = getAuth0IdFromSession(session)
    if (!auth0Id) {
      return NextResponse.json({ error: "Missing auth0_id" }, { status: 400 })
    }

    console.log("🔍 Buscando estudiante con auth0_id:", auth0Id)

    // USER DATA
    const { rows: userRows } = await sql`
      SELECT 
        full_name AS name,
        email,
        profile_image_url AS "profilePicture"
      FROM students
      WHERE auth0_id = ${auth0Id}
      LIMIT 1;
    `

    if (userRows.length === 0) {
      console.error("❌ No se encontró estudiante en la base de datos")
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    console.log("✅ Estudiante encontrado:", userRows[0].name)

    // STATS DATA
    const { rows: statsRows } = await sql`
      SELECT 
        COUNT(*)::int AS enrolled_courses,
        COALESCE(SUM(CASE WHEN completed THEN 1 ELSE 0 END), 0)::int AS completed_courses
      FROM enrollments
      WHERE student_id = (
        SELECT id FROM students WHERE auth0_id = ${auth0Id}
      );
    `

    console.log("📊 Stats encontrados:", statsRows[0])

    // RECENT COURSES
    const { rows: coursesRows } = await sql`
      SELECT 
        e.id,
        c.id as course_id,
        c.title,
        c.thumbnail,
        c.instructor_name,
        COALESCE(e.completed_lessons, 0) as completed_lessons,
        COALESCE(c.total_lessons, 10) as total_lessons,
        COALESCE(e.progress_percentage, 0) as progress_percentage
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = (
        SELECT id FROM students WHERE auth0_id = ${auth0Id}
      )
      ORDER BY e.updated_at DESC
      LIMIT 5;
    `

    console.log("📚 Cursos encontrados:", coursesRows.length)

    const recentCourses = coursesRows.map(row => ({
      id: row.id,
      courses: {
        id: row.course_id,
        title: row.title,
        thumbnail: row.thumbnail,
        instructor_name: row.instructor_name
      },
      progress: [{
        completed_lessons: row.completed_lessons,
        total_lessons: row.total_lessons,
        progress_percentage: row.progress_percentage
      }]
    }))

    // AVERAGE PROGRESS
    const averageProgress = recentCourses.length > 0 
      ? recentCourses.reduce((acc, course) => acc + (course.progress[0]?.progress_percentage || 0), 0) / recentCourses.length
      : 0

    const responseData = {
      user: userRows[0],
      stats: {
        enrolledCourses: statsRows[0]?.enrolled_courses || 0,
        completedCourses: statsRows[0]?.completed_courses || 0,
        certificates: statsRows[0]?.completed_courses || 0,
        studyTimeHours: 0 // Por ahora 0, puedes calcularlo después
      },
      recentCourses: recentCourses,
      averageProgress: averageProgress
    }

    console.log("✅ Datos reales enviados:", responseData)
    return NextResponse.json(responseData)

  } catch (error) {
    console.error("❌ Error real en /api/student/stats:", error)
    return NextResponse.json({ 
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}