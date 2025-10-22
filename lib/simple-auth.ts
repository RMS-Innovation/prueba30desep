// @/lib/simple-auth.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Define la estructura del usuario que tu aplicación espera
export interface User {
  id: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  isLoggedIn: boolean;
}

// ==========================================================
// VERSIÓN FINAL Y SEGURA de getSimpleSession
// ==========================================================
export async function getSimpleSession(): Promise<{ user: User | null; isLoggedIn: boolean }> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // 1. Usa getUser() para verificar la sesión contra el servidor Supabase
    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("[simple-auth] Error fetching Supabase user:", userError.message);
      return { user: null, isLoggedIn: false };
    }

    if (authUser) {
      // 2. Intenta obtener datos desde user_metadata
      let userRole = authUser.user_metadata?.role;
      let firstName = authUser.user_metadata?.firstName;
      let lastName = authUser.user_metadata?.lastName;
      console.log("[simple-auth] Role from metadata:", userRole); // Log para depurar

      // 3. Fallback: Si FALTA ALGUNO (rol, nombre, apellido), consulta public.users
      if (!userRole || !firstName || !lastName) {
        console.log("[simple-auth] Data missing in metadata, querying public.users for ID:", authUser.id);
        const { data: publicUserData, error: publicUserError } = await supabase
          .from('users') // Tu tabla pública de usuarios
          .select('role, first_name, last_name') // Selecciona rol y nombres
          .eq('id', authUser.id) // Busca por el ID de auth.users (UUID)
          .maybeSingle(); // Usa maybeSingle por si acaso

        if (publicUserError) {
           console.warn("[simple-auth] Could not fetch details from public.users:", publicUserError.message);
           // Si la consulta falla Y NO teníamos rol de metadata, usa 'student' como último recurso
           if (!userRole) userRole = 'student';
        } else if (publicUserData) {
          // Si encontró datos en public.users:
          // - Usa el rol de public.users SOLO SI no venía en metadata.
          if (!userRole) userRole = publicUserData.role || 'student';
          // - Usa nombre/apellido de public.users SOLO SI no venían en metadata.
          if (!firstName) firstName = publicUserData.first_name;
          if (!lastName) lastName = publicUserData.last_name;
          console.log("[simple-auth] Data obtained/merged from public.users. Final role:", userRole); // Log
        } else {
           // Si no encontró el usuario en public.users (debería existir!)
           console.warn("[simple-auth] User ID not found in public.users:", authUser.id);
           if (!userRole) userRole = 'student'; // Rol por defecto si falta en todos lados
        }
      }

      // 4. Valores por defecto finales si algo falló
      if (!userRole) userRole = 'student';
      if (!firstName) firstName = 'Usuario';
      if (!lastName) lastName = '';

      // 5. Construye el objeto User final
      const userObject: User = {
        id: authUser.id,
        email: authUser.email,
        role: userRole,
        firstName: firstName,
        lastName: lastName,
        name: `${firstName} ${lastName}`.trim() || authUser.email, // Nombre o email
        isLoggedIn: true,
      };
      console.log("[simple-auth] Returning session with final role:", userRole, "for user:", userObject.id); // Log final
      return { user: userObject, isLoggedIn: true };
    }

    // Si getUser() no devuelve usuario
    console.log("[simple-auth] No authenticated user found by getUser().");
    return { user: null, isLoggedIn: false };

  } catch (error) {
    console.error("[simple-auth] Unexpected error:", error);
    return { user: null, isLoggedIn: false };
  }
}

// Las funciones antiguas createSimpleSession, destroySimpleSession, setSimpleSession
// ya NO son necesarias y deben eliminarse si aún existen.
