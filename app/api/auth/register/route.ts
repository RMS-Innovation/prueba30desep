// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase con Service Role Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      role, // 'student' o 'instructor'
      // Otros campos opcionales como phone, specialization, etc., ya no son necesarios aquí
    } = body;

    // Validación de campos obligatorios
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    console.log("[API Register] Attempting Supabase Auth user creation with data:", { email, firstName, lastName, role });

    // 1. Crear usuario en Supabase Auth, pasando datos extra en user_metadata
    //    El trigger 'handle_new_user' se encargará de crear el perfil en 'public.users'.
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Puedes ponerlo en false si quieres que el usuario confirme
        user_metadata: { // <-- ¡IMPORTANTE! Pasar los datos aquí
          firstName,
          lastName,
          role,
        },
      });

    if (authError) {
      console.error("[API Register] Supabase Auth createUser error:", authError.message);
      // Devuelve un error más específico si el usuario ya existe
      if (authError.message.includes("User already exists")) {
         return NextResponse.json(
           { success: false, error: "Este correo electrónico ya está registrado." },
           { status: 409 } // 409 Conflict
         );
      }
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    // Si la creación fue exitosa, el trigger ya hizo el trabajo en public.users
    const userId = authData.user?.id;
     if (!userId) {
       console.error("[API Register] User created in Auth, but ID is missing in response.");
       // Esto es muy raro, pero mejor manejarlo
       return NextResponse.json({ success: false, error: "Error al obtener ID del usuario creado." }, { status: 500 });
     }

    console.log("[API Register] User created successfully in Supabase Auth. ID:", userId, "Role sent:", role);
    // Ya no necesitamos llamar a RPC ni hacer updates aquí, el trigger lo maneja.

    return NextResponse.json({ success: true, userId });

  } catch (err: any) {
    console.error("[API Register] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error inesperado en el servidor" },
      { status: 500 }
    );
  }
}
