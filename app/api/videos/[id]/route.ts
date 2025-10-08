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
    const videoId = params.id

    // Get video with course information
    const { data: video, error } = await supabase
      .from("videos")
      .select(`
        *,
        courses (
          id,
          title,
          instructor_id,
          price
        )
      `)
      .eq("id", videoId)
      .single()

    if (error || !video) {
      return NextResponse.json({ message: "Video no encontrado" }, { status: 404 })
    }

    // Check access permissions
    const course = video.courses as any
    const hasAccess =
      session.role === "admin" ||
      course.instructor_id === session.userId ||
      video.is_preview ||
      // TODO: Check if user has purchased course or has active subscription
      false

    if (!hasAccess) {
      return NextResponse.json({ message: "Acceso denegado" }, { status: 403 })
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error("Get video error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn || !["instructor", "admin"].includes(session.role || "")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { title, description, orderIndex, isPreview } = await request.json()
    const supabase = createServerSupabaseClient()
    const videoId = params.id

    // Get video with course info to check ownership
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select(`
        *,
        courses (instructor_id)
      `)
      .eq("id", videoId)
      .single()

    if (fetchError || !video) {
      return NextResponse.json({ message: "Video no encontrado" }, { status: 404 })
    }

    const course = video.courses as any
    if (course.instructor_id !== session.userId && session.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    // Update video
    const { data: updatedVideo, error: updateError } = await supabase
      .from("videos")
      .update({
        title,
        description,
        order_index: orderIndex,
        is_preview: isPreview,
        updated_at: new Date().toISOString(),
      })
      .eq("id", videoId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ message: "Error al actualizar video" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Video actualizado exitosamente",
      video: updatedVideo,
    })
  } catch (error) {
    console.error("Update video error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn || !["instructor", "admin"].includes(session.role || "")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    const videoId = params.id

    // Get video with course info to check ownership
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select(`
        *,
        courses (instructor_id)
      `)
      .eq("id", videoId)
      .single()

    if (fetchError || !video) {
      return NextResponse.json({ message: "Video no encontrado" }, { status: 404 })
    }

    const course = video.courses as any
    if (course.instructor_id !== session.userId && session.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    // Delete video file from storage
    if (video.video_url) {
      const fileName = video.video_url.split("/").pop()
      if (fileName) {
        await supabase.storage.from("videos").remove([`courses/${video.course_id}/${fileName}`])
      }
    }

    // Delete thumbnail if exists
    if (video.thumbnail_url) {
      const thumbName = video.thumbnail_url.split("/").pop()
      if (thumbName) {
        await supabase.storage.from("videos").remove([`courses/${video.course_id}/${thumbName}`])
      }
    }

    // Delete video record
    const { error: deleteError } = await supabase.from("videos").delete().eq("id", videoId)

    if (deleteError) {
      return NextResponse.json({ message: "Error al eliminar video" }, { status: 500 })
    }

    return NextResponse.json({ message: "Video eliminado exitosamente" })
  } catch (error) {
    console.error("Delete video error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
