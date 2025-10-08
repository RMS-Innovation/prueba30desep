import { type NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/session"
import { createServerSupabaseClient } from "@/lib/supabase"
import { checkRateLimit } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn || !["instructor", "admin"].includes(session.role || "")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Rate limiting for video uploads
    const rateLimit = await checkRateLimit(session.userId!, "video_upload", 10, 60) // 10 uploads per hour

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Límite de subidas excedido. Intenta más tarde." }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get("video") as File
    const courseId = formData.get("courseId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const orderIndex = Number.parseInt(formData.get("orderIndex") as string)
    const isPreview = formData.get("isPreview") === "true"

    if (!file || !courseId || !title) {
      return NextResponse.json({ message: "Datos requeridos faltantes" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/avi"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "Tipo de archivo no válido" }, { status: 400 })
    }

    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      return NextResponse.json({ message: "Archivo demasiado grande (máximo 500MB)" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Verify course ownership
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("instructor_id")
      .eq("id", courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ message: "Curso no encontrado" }, { status: 404 })
    }

    if (course.instructor_id !== session.userId && session.role !== "admin") {
      return NextResponse.json({ message: "No autorizado para este curso" }, { status: 403 })
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `courses/${courseId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from("videos").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ message: "Error al subir video" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("videos").getPublicUrl(fileName)

    // Create video record in database
    const { data: videoData, error: videoError } = await supabase
      .from("videos")
      .insert({
        course_id: courseId,
        title,
        description,
        video_url: urlData.publicUrl,
        order_index: orderIndex,
        is_preview: isPreview,
        duration_seconds: 0, // Will be updated after processing
      })
      .select()
      .single()

    if (videoError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("videos").remove([fileName])
      return NextResponse.json({ message: "Error al crear registro de video" }, { status: 500 })
    }

    // TODO: Queue video for processing (FFmpeg transcoding, thumbnail generation)
    // This would typically be done with a background job queue

    return NextResponse.json({
      message: "Video subido exitosamente",
      video: videoData,
    })
  } catch (error) {
    console.error("Video upload error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
