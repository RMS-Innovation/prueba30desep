// @/lib/auth-utils.tsx

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Tipos de datos
type RegisterUserData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor';
};

export type SessionData = SupabaseUser & { role?: string };

interface AuthContextInterface {
  user: SessionData | null;
  login(email: string, password: string): Promise<{ success: boolean; error?: string }>;
  register(userData: RegisterUserData): Promise<{ success: boolean; error?: string }>;
  logout(): Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { success: false, error: 'Credenciales inválidas.' } : { success: true };
  };

  const register = async (userData: RegisterUserData) => {
    const { error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: { data: { firstName: userData.firstName, lastName: userData.lastName, role: userData.role } },
    });
    return error ? { success: false, error: error.message } : { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const value: AuthContextInterface = { user, login, register, logout, loading };

  if (loading) return null; // Puedes poner un spinner aquí si quieres

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
