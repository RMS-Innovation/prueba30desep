import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { setSimpleSession } from "@/lib/simple-auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === ADMIN LOGIN STARTED ===")
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for admin:", email)

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Crear cliente de Supabase
    const supabase = createServerSupabaseClient()

    // Buscar usuario admin
    console.log("[v0] Searching for admin user...")
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(`
        id, email, password_hash, first_name, last_name, profile_image_url, is_active,
        admin_profiles (
          id, admin_id, department, permissions, last_login
        )
      `)
      .eq("email", email)
      .eq("role", "admin")
      .eq("is_active", true)
      .single()

    if (userError || !user) {
      console.log("[v0] Admin not found:", userError?.message)
      return NextResponse.json({ success: false, error: "Acceso denegado" }, { status: 401 })
    }

    console.log("[v0] Admin found:", user.email)

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
      console.log("[v0] Invalid password for admin")
      return NextResponse.json({ success: false, error: "Acceso denegado" }, { status: 401 })
    }

    // Actualizar último login
    if (user.admin_profiles?.[0]) {
      await supabase
        .from("admin_profiles")
        .update({ last_login: new Date().toISOString() })
        .eq("id", user.admin_profiles[0].id)
    }

    // Crear datos de sesión
    const sessionData = {
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      role: "admin",
      profilePicture: user.profile_image_url,
      adminProfile: user.admin_profiles?.[0] || null,
    }

    console.log("[v0] Setting session for admin:", sessionData.name)

    // Establecer sesión
    const response = NextResponse.json({
      success: true,
      user: sessionData,
    })

    await setSimpleSession(response, sessionData)

    console.log("[v0] Admin login successful")
    return response
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
