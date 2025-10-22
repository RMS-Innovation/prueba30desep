// app/api/auth/admin/login/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js"; // Para el cliente Admin

// --- La función POST se mantiene igual que la versión correcta anterior ---
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const supabaseAdmin = createClient( // Cliente Admin con claves
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
      
    );

    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    // ... (manejo de error signInError) ...
    if (signInError || !authData.user) {
         // ... (retorna 401 o 500) ...
         return NextResponse.json({ error: signInError?.message || "Error post-login" }, { status: signInError ? 401: 500 });
    }


    console.log("[Admin Login API] Verifying role via Admin Client for user ID:", authData.user.id);
    const { data: userData, error: userFetchError } = await supabaseAdmin // <-- Usa Admin
      .from("users")
      .select("role, admins(*)")
      .eq("id", authData.user.id) // <-- Busca por 'id'
      .maybeSingle();

    if (userFetchError) { /* ... manejo de error de consulta ... */ }

    console.log("[Admin Login API] Data fetched from public.users:", JSON.stringify(userData, null, 2));

    if (!userData || userData.role !== "admin") {
      console.warn("[Admin Login API] Access Denied. User data exists:", !!userData, "Role found:", userData?.role);
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Acceso denegado. Se requieren privilegios de administrador." }, { status: 403 });
    }

    console.log("[Admin Login API] Admin access granted for:", authData.user.email);
    return NextResponse.json({ /* ... datos de éxito ... */ });

  } catch (error: any) { /* ... manejo de error ... */ }
}

// ==========================================================
// INICIO CORRECCIÓN: Se añaden los argumentos a createClient en GET
// ==========================================================
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Cliente Admin para la consulta - ¡AHORA CON ARGUMENTOS!
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verifica rol usando el CLIENTE ADMIN
    const { data: userData, error: userFetchError } = await supabaseAdmin // <-- Usa Admin
      .from("users")
      .select("role, admins(*)")
      .eq("id", user.id) // <-- Usa 'id'
      .maybeSingle();

    if (userFetchError || !userData || userData.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({
       user: { id: user.id, email: user.email, role: userData.role },
       adminData: userData.admins,
    });

  } catch (error: any) {
    console.error("[Admin Login API - GET] Unexpected error:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
// ==========================================================
// FIN CORRECCIÓN
// ==========================================================
