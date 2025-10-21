// @/lib/auth-utils.tsx

'use client';

import type React from "react"; // Añadido import explícito de React
import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Definición de tipos para los datos del formulario de registro
type RegisterUserData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor';
};

// Tipo para los datos de la sesión del usuario
export type SessionData = SupabaseUser & { role?: string };

// Interfaz para el contexto de autenticación (más robusta que 'type' para JSX)
interface AuthContextInterface {
  user: SessionData | null;
  // login ahora devuelve el usuario si tiene éxito
  login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: SupabaseUser | null }>;
  register(userData: RegisterUserData): Promise<{ success: boolean; error?: string }>;
  logout(): Promise<void>;
  loading: boolean;
}

// Creación del contexto
const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

// Provider que envolverá la aplicación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener para cambios de estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("AuthProvider: onAuthStateChange triggered. Session User:", session?.user?.id);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    // Limpieza al desmontar
    return () => {
        console.log("AuthProvider: Unsubscribing auth listener.");
        authListener.subscription.unsubscribe();
    };
  }, [supabase]); // Dependencia correcta

  // Función de LOGIN
  const login = async (email: string, password: string) => {
    console.log("AuthProvider: Attempting signInWithPassword...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("AuthProvider: signInWithPassword Error:", error.message);
      return { success: false, error: "Credenciales inválidas." };
    }
    console.log("AuthProvider: signInWithPassword Success. User ID:", data.user?.id);
    return { success: true, user: data.user };
  };

  // Función de REGISTER (Aquí usamos RegisterUserData)
  const register = async (userData: RegisterUserData) => {
    console.log("AuthProvider: Attempting signUp with data:", userData);
    // Extraemos las propiedades de userData para asegurar que existen
    const { email, password, firstName, lastName, role } = userData;
    const { error } = await supabase.auth.signUp({
      email: email, // Usamos la variable extraída
      password: password, // Usamos la variable extraída
      options: {
        data: {
          firstName: firstName, // Usamos la variable extraída
          lastName: lastName, // Usamos la variable extraída
          role: role // Usamos la variable extraída
        }
      }
    });
     if (error) {
        console.error("AuthProvider: signUp Error:", error.message);
    } else {
        console.log("AuthProvider: signUp Success.");
    }
    return error ? { success: false, error: error.message } : { success: true };
  };

  // Función de LOGOUT
  const logout = async () => {
    console.log("AuthProvider: Attempting signOut...");
    await supabase.auth.signOut();
    console.log("AuthProvider: signOut completed. Redirecting...");
    router.push("/auth/login");
  };

  // Valor del contexto
  const value: AuthContextInterface = { user, login, register, logout, loading };

  // Evita renderizar hijos hasta que la sesión se cargue
  if (loading) {
     console.log("AuthProvider: Initial load, returning null.");
     return null;
  }

  console.log("AuthProvider: Rendering provider with User ID:", user?.id);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook 'useAuth'
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};