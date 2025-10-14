// app/api/auth/login/route.ts (o la ruta que corresponda)
import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "unknown"
    const rateLimit = await checkRateLimit(clientIP, "login", 15, 15)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Demasiados intentos de login. Intenta de nuevo en 15 minutos." },
        { status: 429 },
      )
    }

    const supabase = createServerSupabaseClient()

    // Buscar usuario en la base de datos
    const searchEmail = email.toLowerCase()
    const { data: userData, error } = await supabase
      .from("users")
      .select("id, email, password_hash, role, first_name, last_name, profile_image_url, is_active")
      .eq("email", searchEmail)
      .eq("is_active", true)
      .single()

    if (error || !userData) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, userData.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
    }

    let roleSpecificData = null
    if (userData.role === "student") {
      const { data: studentData } = await supabase
        .from("students")
        // Comentario: Corregido de "student_number" a "student_code"
        .select("id, student_code, university, academic_level") 
        .eq("user_id", userData.id)
        .single()
      roleSpecificData = studentData
    } else if (userData.role === "instructor") {
      const { data: instructorData } = await supabase
        .from("instructors")
        // Comentario: Corregido de "instructor_number" a "instructor_code"
        .select("id, instructor_code, specialization, bio")
        .eq("user_id", userData.id)
        .single()
      roleSpecificData = instructorData
    } else if (userData.role === "admin") {
      const { data: adminData } = await supabase
        .from("admins")
        // Comentario: Corregido de "admin_number" a "admin_code"
        .select("id, admin_code, department")
        .eq("user_id", userData.id)
        .single()
      roleSpecificData = adminData
    }

    const userSessionData = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      firstName: userData.first_name,
      lastName: userData.last_name,
      profilePicture: userData.profile_image_url,
      roleSpecific: roleSpecificData,
      isLoggedIn: true,
    }

    const response = NextResponse.json(userSessionData)

    response.cookies.set(
      "simple-session",
      JSON.stringify({
        user: userSessionData,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      },
    )

    return response

  } catch (error) {
    console.error("[LOGIN_API_ERROR]", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}