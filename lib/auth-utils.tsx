// @/lib/auth-utils.tsx

'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor';
}

export interface AuthUser {
  id: string;
  email: string | null;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  name: string;
}

interface AuthContextInterface {
  user: AuthUser | null;
  loading: boolean;
  login(email: string, password: string): Promise<{ success: boolean; error?: string }>;
  register(data: RegisterUserData): Promise<{ success: boolean; error?: string }>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const parseUser = (raw: any): AuthUser => {
    const md = raw?.user_metadata ?? {};
    return {
      id: raw.id,
      email: raw.email ?? null,
      role: md.role ?? 'student',
      firstName: md.firstName ?? null,
      lastName: md.lastName ?? null,
      name:
        md.firstName || md.lastName
          ? `${md.firstName ?? ''} ${md.lastName ?? ''}`.trim()
          : raw.email ?? '',
    };
  };

  useEffect(() => {
    let active = true;

    async function loadInitialUser() {
      const { data: { user: initialUser } } = await supabase.auth.getUser();
      if (active && initialUser) {
        setUser(parseUser(initialUser));
      }
      setLoading(false);
    }

    loadInitialUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const sUser = session?.user ?? null;
      if (sUser) {
        setUser(parseUser(sUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, [supabase]);

  // const login = async (email: string, password: string) => {
  //   const { error } = await supabase.auth.signInWithPassword({ email, password });
  //   if (error) {
  //     return { success: false, error: error.message };
  //   }
  //   return { success: true };
  // };
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Recupera el usuario después del login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { success: true, user };
  };

  const register = async (data: RegisterUserData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
