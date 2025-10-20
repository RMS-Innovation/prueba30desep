// @/lib/simple-auth.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Define la estructura del usuario que tu aplicación espera
// Asegúrate de que coincida con los datos que realmente necesitas
export interface User {
  id: string;
  email?: string; // El email puede ser opcional dependiendo de tu configuración
  role?: string; // El rol viene de 'user_metadata' o tu tabla 'users'
  firstName?: string; // Viene de 'user_metadata' o tu tabla 'users'
  lastName?: string; // Viene de 'user_metadata' o tu tabla 'users'
  name?: string; // Podemos construirlo a partir de firstName y lastName
  isLoggedIn: boolean;
  // Añade otros campos si los necesitas directamente en la sesión
}

// La NUEVA función getSimpleSession usando Supabase Helpers
export async function getSimpleSession(): Promise<{ user: User | null; isLoggedIn: boolean }> {
  const cookieStore = cookies();
  // Crea un cliente Supabase específico para Componentes de Servidor
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // Intenta obtener la sesión activa de Supabase
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching Supabase session:", error.message);
      return { user: null, isLoggedIn: false };
    }

    if (session) {
      // Si hay sesión, construimos el objeto User que tu app espera
      const userMetadata = session.user.user_metadata;
      const userRole = userMetadata?.role || 'student'; // Obtiene el rol, default 'student'

      // Intenta obtener datos adicionales de tu tabla 'public.users' si es necesario
      // Esto es opcional, dependiendo de si necesitas datos que no estén en user_metadata
      /*
      const { data: publicUserData, error: publicUserError } = await supabase
        .from('users')
        .select('first_name, last_name, profile_image_url') // Selecciona los campos que necesites
        .eq('id', session.user.id)
        .single();

      if (publicUserError) {
         console.warn("Could not fetch public user data:", publicUserError.message);
      }
      */

      const firstName = userMetadata?.firstName // || publicUserData?.first_name;
      const lastName = userMetadata?.lastName // || publicUserData?.last_name;

      const userObject: User = {
        id: session.user.id,
        email: session.user.email,
        role: userRole,
        firstName: firstName,
        lastName: lastName,
        name: firstName && lastName ? `${firstName} ${lastName}` : session.user.email, // Nombre completo o email
        isLoggedIn: true,
      };
      return { user: userObject, isLoggedIn: true };
    }

    // Si no hay sesión
    return { user: null, isLoggedIn: false };

  } catch (error) {
    console.error("Unexpected error in getSimpleSession:", error);
    return { user: null, isLoggedIn: false };
  }
}

// Las funciones createSimpleSession, destroySimpleSession, setSimpleSession ya NO son necesarias.
// Supabase Auth Helpers manejan la creación y destrucción de cookies automáticamente.
// Puedes eliminar esas funciones de este archivo.
