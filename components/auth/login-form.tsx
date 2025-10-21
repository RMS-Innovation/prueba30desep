// @/components/auth/login-form.tsx

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-utils";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function LoginForm() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("[v0] Attempting login with:", { email, password: "***" });

    try {
      const result = await login(email, password);
      console.log("[v0] Login result:", result);

      // Primero, verifica si el login fue exitoso
      if (result.success) {
        // LUEGO, verifica si el objeto 'user' existe en el resultado
        if (result.user) {
          const user = result.user; // Ahora TypeScript sabe que 'user' existe
          console.log("[v0] Login successful, user data from login:", user);

          // Obtén el rol (prioriza metadatos, luego tabla 'users')
          let userRole = user.user_metadata?.role;
          console.log("[v0] Role from metadata:", userRole);

          if (!userRole) {
            console.log("[v0] Role not in metadata, querying public.users...");
            const { data: publicUserData, error: publicUserError } =
              await supabase
                .from("users")
                .select("role")
                .eq("id", user.id)
                .maybeSingle(); // Usamos maybeSingle

            if (publicUserError) {
              console.warn(
                "[v0] Could not fetch role from public.users:",
                publicUserError.message
              );
              if (publicUserError.message.includes("multiple rows")) {
                setError(
                  "Error: Múltiples perfiles encontrados. Contacta soporte."
                );
                setLoading(false);
                return;
              }
              userRole = "student"; // Rol por defecto si falla o no hay rol
            } else {
              userRole = publicUserData?.role || "student";
            }
            console.log("[v0] Role from public.users (or default):", userRole);
          }

          // Determina la URL de redirección
          let targetDashboard = "/dashboard/student";
          if (userRole === "instructor") {
            targetDashboard = "/dashboard/instructor";
          } else if (userRole === "admin") {
            targetDashboard = "/dashboard/admin";
          }

          console.log("[v0] Redirecting to:", targetDashboard);
          // Redirige
          router.push(targetDashboard);

        } else {
          // Caso improbable donde success es true pero no hay user
          console.error("[v0] Login successful but no user data returned!");
          setError("Error inesperado al obtener datos del usuario.");
        }
      } else {
        // Si el login falló
        console.log("[v0] Login failed:", result.error);
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("[v0] Login submit error:", err);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Muestra skeleton loader mientras el componente se monta
  if (!mounted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Iniciar Sesión
        </CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder a la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <Button
                 type="button"
                 variant="ghost"
                 size="sm"
                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                 onClick={() => setShowPassword(!showPassword)}
                 disabled={loading}
              >
                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">¿No tienes cuenta? </span>
          <Link
            href="/auth/register"
            className="text-primary hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}