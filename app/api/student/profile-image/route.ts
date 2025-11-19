import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"//REVISAR RUTA
import { getSimpleSession } from "@/lib/getSimpleSession"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Profile image API called")

    // Validar sesión
    const session = await getSimpleSession()
    console.log("[v0] Session data:", session)

    if (!session?.user) {
      console.log("[v0] No session found, returning 401")
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    console.log("[v0] User ID from session:", session.user.id)

    try {
      const supabase = createServerSupabaseClient()

      // Obtener información de la imagen del usuario
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, profile_image_url")
        .eq("id", session.user.id)
        .eq("is_active", true)
        .single()

      console.log("[v0] Database query result:", { userData, userError })

      if (userError) {
        console.log("[v0] Database error:", userError)
        return NextResponse.json({
          hasImage: !!session.user.profileImage,
          imageUrl: session.user.profileImage,
          source: "session_fallback",
        })
      }

      if (!userData) {
        console.log("[v0] No user data found")
        return NextResponse.json({
          hasImage: false,
          imageUrl: null,
          message: "Usuario no encontrado",
        })
      }

      console.log("[v0] Profile image URL from DB:", userData.profile_image_url)

      return NextResponse.json({
        hasImage: !!userData.profile_image_url,
        imageUrl: userData.profile_image_url,
        source: "database",
      })
    } catch (dbError) {
      console.log("[v0] Database connection failed, using session data:", dbError)
      return NextResponse.json({
        hasImage: !!session.user.profileImage,
        imageUrl: session.user.profileImage,
        source: "session_fallback",
      })
    }
  } catch (error) {
    console.error("[v0] Profile image API error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
