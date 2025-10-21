import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] === FETCHING INSTRUCTOR STUDENTS ===")

    // Get session to verify instructor
    const session = await getSession()

    if (!session?.user || session.user.role !== "instructor") {
      console.log("[v0] Unauthorized: Not an instructor")
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const instructorUserId = session.user.id
    console.log("[v0] Instructor user ID:", instructorUserId)

    // Create Supabase client
    const supabase = createServerSupabaseClient()

    // Get instructor profile to find their ID
    const { data: instructorProfile, error: instructorError } = await supabase
      .from("instructors")
      .select("id")
      .eq("user_id", instructorUserId)
      .single()

    if (instructorError || !instructorProfile) {
      console.log("[v0] Instructor profile not found:", instructorError?.message)
      return NextResponse.json({ success: false, error: "Perfil de instructor no encontrado" }, { status: 404 })
    }

    const instructorId = instructorProfile.id
    console.log("[v0] Instructor ID:", instructorId)

    // Fetch enrollments for courses created by this instructor
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select(`
        id,
        enrolled_at,
        progress,
        completed_at,
        student:students!enrollments_student_id_fkey (
          id,
          user:users!students_user_id_fkey (
            id,
            first_name,
            last_name,
            profile_image_url
          )
        ),
        course:courses!enrollments_course_id_fkey (
          id,
          title,
          instructor_id
        )
      `)
      .eq("course.instructor_id", instructorId)
      .order("enrolled_at", { ascending: false })

    if (enrollmentsError) {
      console.log("[v0] Error fetching enrollments:", enrollmentsError.message)
      return NextResponse.json({ success: false, error: "Error al obtener estudiantes" }, { status: 500 })
    }

    // Transform data to match StudentsList component interface
    const transformedEnrollments = enrollments.map((enrollment: any) => ({
      id: enrollment.id,
      enrolled_at: enrollment.enrolled_at,
      progress: enrollment.progress || 0,
      completed_at: enrollment.completed_at,
      student: {
        id: enrollment.student.user.id,
        first_name: enrollment.student.user.first_name,
        last_name: enrollment.student.user.last_name,
        profile_picture_url: enrollment.student.user.profile_image_url,
      },
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
      },
    }))

    console.log("[v0] Found", transformedEnrollments.length, "enrollments")

    return NextResponse.json({
      success: true,
      enrollments: transformedEnrollments,
    })
  } catch (error) {
    console.error("[v0] Error in instructor students API:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
