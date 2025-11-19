import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"//REVISAR RUTA
import { getSimpleSession } from "@/lib/getSimpleSession"
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

    // Buscar usuario instructor - CORREGIDO según tu esquema
    console.log("[v0] Searching for instructor user...")
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(`
        id, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        profile_image_url, 
        is_active,
        role,
        instructors (
          id, 
          instructor_code,
          bio, 
          specialization, 
          license_number, 
          years_of_experience, 
          average_rating,
          total_students_taught,
          total_courses_created,
          is_verified,
          status
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

    // Verificar que el instructor esté aprobado
    const instructorProfile = Array.isArray(user.instructors) ? user.instructors[0] : user.instructors
    
    if (!instructorProfile || instructorProfile.status !== 'approved') {
      console.log("[v0] Instructor not approved or profile missing")
      return NextResponse.json({ 
        success: false, 
        error: "Tu cuenta de instructor no está aprobada o está suspendida" 
      }, { status: 401 })
    }

    console.log("[v0] Instructor found:", user.email)

    // Verificar contraseña
    let passwordValid = false

    if (!user.password_hash) {
      console.log("[v0] No password hash found")
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 })
    }

    if (
      user.password_hash.startsWith("$2a$") ||
      user.password_hash.startsWith("$2b$") ||
      user.password_hash.startsWith("$2y$")
    ) {
      // Hash bcrypt válido
      passwordValid = await bcrypt.compare(password, user.password_hash)
    } else {
      // Comparación directa para contraseñas en texto plano (solo desarrollo)
      passwordValid = password === user.password_hash
    }

    if (!passwordValid) {
      console.log("[v0] Invalid password for instructor")
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 })
    }

    // Crear datos de sesión - CORREGIDO con tipos específicos
    const sessionData = {
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role as "instructor", // Asegurar el tipo específico
      profilePicture: user.profile_image_url,
      instructorProfile: {
        id: instructorProfile.id,
        instructor_code: instructorProfile.instructor_code,
        bio: instructorProfile.bio,
        specialization: instructorProfile.specialization,
        license_number: instructorProfile.license_number,
        years_of_experience: instructorProfile.years_of_experience,
        average_rating: instructorProfile.average_rating,
        total_students_taught: instructorProfile.total_students_taught,
        total_courses_created: instructorProfile.total_courses_created,
        is_verified: instructorProfile.is_verified,
        status: instructorProfile.status
      },
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