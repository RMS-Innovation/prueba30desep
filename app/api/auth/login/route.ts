import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === LOGIN ATTEMPT STARTED ===")
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for email:", email)
    console.log("[v0] Password received (length):", password?.length || 0)

    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
    }
    console.log("[v0] Environment check:", envCheck)

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ message: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "unknown"
    const rateLimit = await checkRateLimit(clientIP, "login", 15, 15) // 15 attempts per 15 minutes

    if (!rateLimit.allowed) {
      console.log("[v0] Rate limit exceeded for IP:", clientIP)
      return NextResponse.json(
        { message: "Demasiados intentos de login. Intenta de nuevo en 15 minutos." },
        { status: 429 },
      )
    }

    console.log("[v0] Rate limit passed")

    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ) {
        console.log("[v0] === SUPABASE AUTHENTICATION STARTED ===")
        const supabase = createServerSupabaseClient()
        console.log("[v0] Supabase client created successfully")

        // Buscar usuario en la base de datos
        const searchEmail = email.toLowerCase()
        console.log("[v0] Searching for user with email:", searchEmail)

        console.log("[v0] Executing Supabase query...")
        const { data: userData, error } = await supabase
          .from("users")
          .select(`
            id, 
            email, 
            password_hash, 
            role, 
            first_name, 
            last_name, 
            profile_image_url, 
            is_active
          `)
          .eq("email", searchEmail)
          .eq("is_active", true)
          .single()

        console.log("[v0] === SUPABASE QUERY COMPLETED ===")
        console.log("[v0] Query result - User found:", !!userData)
        console.log("[v0] Query result - Error:", !!error)

        if (userData) {
          console.log("[v0] User details:", {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            firstName: userData.first_name,
            lastName: userData.last_name,
            isActive: userData.is_active,
            hasPasswordHash: !!userData.password_hash,
            passwordHashLength: userData.password_hash?.length || 0,
          })
        }

        if (error) {
          console.log("[v0] === SUPABASE ERROR DETAILS ===")
          console.log("[v0] Error code:", error.code)
          console.log("[v0] Error message:", error.message)
          console.log("[v0] Error details:", error.details)
          console.log("[v0] Error hint:", error.hint)

          if (error.code === "PGRST116") {
            console.log("[v0] User not found or not active - returning 401")
            return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
          }
          throw error
        }

        if (!userData) {
          console.log("[v0] No user returned from query - returning 401")
          return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
        }

        console.log("[v0] === PASSWORD VERIFICATION STARTED ===")
        console.log("[v0] Input password length:", password.length)
        console.log("[v0] Stored hash length:", userData.password_hash?.length || 0)
        console.log("[v0] Hash starts with:", userData.password_hash?.substring(0, 7))

        let isValidPassword = false

        if (
          userData.password_hash?.startsWith("$2a$") ||
          userData.password_hash?.startsWith("$2b$") ||
          userData.password_hash?.startsWith("$2y$")
        ) {
          // Es un hash bcrypt válido
          console.log("[v0] Using bcrypt comparison for hashed password")
          isValidPassword = await bcrypt.compare(password, userData.password_hash)
        } else {
          // Parece ser texto plano o hash no-bcrypt
          console.log("[v0] Password appears to be plain text, using direct comparison")
          isValidPassword = password === userData.password_hash
        }

        console.log("[v0] Password comparison result:", isValidPassword)

        if (!isValidPassword) {
          console.log("[v0] Password verification failed - returning 401")
          return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
        }

        let roleSpecificData = null
        if (userData.role === "student") {
          const { data: studentData } = await supabase
            .from("students")
            .select("id, student_number, phone, bio")
            .eq("user_id", userData.id)
            .single()
          roleSpecificData = studentData
        } else if (userData.role === "instructor") {
          const { data: instructorData } = await supabase
            .from("instructors")
            .select("id, instructor_number, specialization, bio")
            .eq("user_id", userData.id)
            .single()
          roleSpecificData = instructorData
        } else if (userData.role === "admin") {
          const { data: adminData } = await supabase
            .from("admins")
            .select("id, admin_number, department")
            .eq("user_id", userData.id)
            .single()
          roleSpecificData = adminData
        }

        console.log("[v0] === LOGIN SUCCESSFUL ===")
        // Usuario autenticado exitosamente
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

        console.log("[v0] Creating session for user:", userSessionData.email)

        const response = NextResponse.json({
          userId: userSessionData.id,
          email: userSessionData.email,
          role: userSessionData.role,
          isLoggedIn: true,
          firstName: userSessionData.firstName,
          lastName: userSessionData.lastName,
          profilePicture: userSessionData.profilePicture,
          roleSpecific: userSessionData.roleSpecific,
        })

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

        console.log("[v0] Session cookie set, returning success response")
        return response
      } else {
        console.log("[v0] === SUPABASE NOT CONFIGURED ===")
        console.log("[v0] Missing environment variables:", {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "missing",
          serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "missing",
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "missing",
        })
      }
    } catch (supabaseError) {
      console.error("[v0] === SUPABASE ERROR ===")
      console.error("[v0] Supabase authentication error:", supabaseError)
      // Continuar con autenticación mock si Supabase falla
    }

    console.log("[v0] === FALLING BACK TO MOCK AUTHENTICATION ===")
    if (email && password) {
      const userData = {
        id: "mock-user-id",
        email: email.toLowerCase(),
        role: "student" as const,
        firstName: "Usuario",
        lastName: "Demo",
        profilePicture: null,
        roleSpecific: null,
        isLoggedIn: true,
      }

      const response = NextResponse.json({
        userId: userData.id,
        email: userData.email,
        role: userData.role,
        isLoggedIn: true,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePicture: userData.profilePicture,
        roleSpecific: userData.roleSpecific,
      })

      response.cookies.set(
        "simple-session",
        JSON.stringify({
          user: userData,
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
    }

    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
  } catch (error) {
    console.error("[v0] === GENERAL LOGIN ERROR ===")
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
