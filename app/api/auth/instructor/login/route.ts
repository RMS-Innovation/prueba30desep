import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { setSimpleSession } from "@/lib/simple-auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === INSTRUCTOR LOGIN STARTED ===")
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for instructor:", email)

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Crear cliente de Supabase
    const supabase = createServerSupabaseClient()

    // Buscar usuario instructor
    console.log("[v0] Searching for instructor user...")
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(`
        id, email, password_hash, first_name, last_name, profile_image_url, is_active,
        instructor_profiles (
          id, instructor_id, bio, specialization, license_number, 
          years_experience, rating, total_students, total_courses
        )
      `)
      .eq("email", email)
      .eq("role", "instructor")
      .eq("is_active", true)
      .single()

    if (userError || !user) {
      console.log("[v0] Instructor not found:", userError?.message)
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 })
    }

    console.log("[v0] Instructor found:", user.email)

    // Verificar contraseña
    let passwordValid = false

    if (
      user.password_hash.startsWith("$2a$") ||
      user.password_hash.startsWith("$2b$") ||
      user.password_hash.startsWith("$2y$")
    ) {
      // Hash bcrypt válido
      passwordValid = await bcrypt.compare(password, user.password_hash)
    } else {
      // Comparación directa para contraseñas en texto plano
      passwordValid = password === user.password_hash
    }

    if (!passwordValid) {
      console.log("[v0] Invalid password for instructor")
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 })
    }

    // Crear datos de sesión
    const sessionData = {
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      role: "instructor",
      profilePicture: user.profile_image_url,
      instructorProfile: user.instructor_profiles?.[0] || null,
    }

    console.log("[v0] Setting session for instructor:", sessionData.name)

    // Establecer sesión
    const response = NextResponse.json({
      success: true,
      user: sessionData,
    })

    await setSimpleSession(response, sessionData)

    console.log("[v0] Instructor login successful")
    return response
  } catch (error) {
    console.error("[v0] Instructor login error:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
