import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
//comentario de prueba 2
// Cliente Supabase con Service Role Key para poder crear usuarios y escribir en tablas protegidas
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      specialization,
      licenseNumber,
    } = body

    // Validación rápida de campos obligatorios
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      )
    }

    // 1. Crear usuario en Supabase Auth
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }

    const auth0Id = authUser.user?.id
    if (!auth0Id) {
      return NextResponse.json(
        { success: false, error: "No se pudo obtener el ID del usuario" },
        { status: 500 }
      )
    }

    // 2. Insertar usuario en la tabla "users" con la función PL/pgSQL
    const { data: userId, error: dbError } = await supabase.rpc(
      "get_or_create_user_from_auth0",
      {
        p_auth0_id: auth0Id,
        p_email: email,
        p_first_name: firstName,
        p_last_name: lastName,
        p_role: role,
        p_auth_provider: "supabase",
      }
    )

    if (dbError) {
      return NextResponse.json(
        { success: false, error: dbError.message },
        { status: 400 }
      )
    }

    // 3. Si es instructor, actualizar datos extra
    if (role === "instructor") {
      await supabase
        .from("instructors")
        .update({
          specialization: specialization || "General",
          license_number: licenseNumber || null,
        })
        .eq("user_id", userId)
    }

    // 4. Si viene teléfono, guardarlo
    if (phone) {
      await supabase.from("users").update({ phone }).eq("id", userId)
    }

    return NextResponse.json({ success: true, userId })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Error inesperado" },
      { status: 500 }
    )
  }
}
