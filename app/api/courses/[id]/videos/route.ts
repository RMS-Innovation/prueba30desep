import { type NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/session"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    const courseId = params.id

    // Get course info to check access
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("instructor_id, price")
      .eq("id", courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ message: "Curso no encontrado" }, { status: 404 })
    }

    // Check if user has access to the course
    const isInstructor = course.instructor_id === session.userId
    const isAdmin = session.role === "admin"

    // TODO: Check if user has purchased course or has active subscription
    const hasPurchased = false

    let videosQuery = supabase
      .from("videos")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true })

    // If user doesn't have full access, only show preview videos
    if (!isInstructor && !isAdmin && !hasPurchased) {
      videosQuery = videosQuery.eq("is_preview", true)
    }

    const { data: videos, error: videosError } = await videosQuery

    if (videosError) {
      return NextResponse.json({ message: "Error al obtener videos" }, { status: 500 })
    }

    return NextResponse.json({
      videos: videos || [],
      hasFullAccess: isInstructor || isAdmin || hasPurchased,
    })
  } catch (error) {
    console.error("Get course videos error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
