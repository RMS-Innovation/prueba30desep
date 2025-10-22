// components/auth/admin-login-form.tsx

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-utils"; // Importa el hook
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Importa el cliente

export function AdminLoginForm() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth(); // Obtén login de useAuth
  const supabase = createClientComponentClient(); // Cliente para consulta de rol

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full max-w-md mx-auto p-6">Cargando...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Llama a la función login del hook
      const result = await login(email, password);
      console.log("[AdminLoginForm] Login result from useAuth:", result);

      if (result.success && result.user) {
        const user = result.user;
        console.log("[AdminLoginForm] Login successful, user ID:", user.id);

        // Verifica el rol
        let userRole = user.user_metadata?.role;
        console.log("[AdminLoginForm] Role from metadata:", userRole);

        if (!userRole) {
          console.log("[AdminLoginForm] Role not in metadata, querying public.users...");
          const { data: publicUserData, error: publicUserError } =
            await supabase
              .from("users")
              .select("role")
              .eq("id", user.id)
              .maybeSingle();

          if (publicUserError) {
            console.warn("[AdminLoginForm] Could not fetch role:", publicUserError.message);
            userRole = 'student'; // Default
          } else {
            userRole = publicUserData?.role || 'student';
          }
        }
        console.log("[AdminLoginForm] Final role determined:", userRole);

        // Comprueba si es admin ANTES de redirigir
        if (userRole === "admin") {
          const redirectTo = searchParams.get("redirect") || "/dashboard/admin";
          console.log("[AdminLoginForm] Admin access confirmed. Redirecting to:", redirectTo);
          router.push(redirectTo);
        } else {
          console.warn("[AdminLoginForm] Access denied. User is not an admin. Role:", userRole);
          setError("Acceso denegado. No tienes privilegios de administrador.");
        }
      } else {
        console.log("[AdminLoginForm] Login failed:", result.error);
        setError(result.error || "Credenciales inválidas.");
      }
    } catch (error: any) {
      console.error("[AdminLoginForm] Submit error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-gray-200 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-center lg:justify-start mb-2">
          <div className="p-2 bg-red-50 rounded-lg">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Iniciar Sesión</CardTitle>
        <CardDescription className="text-gray-600">Ingresa tus credenciales de administrador</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@dentaledu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                // ==================================================
                // INICIO CORRECCIÓN (Línea 161)
                // ==================================================
                onChange={(e) => setPassword(e.target.value)} // Corregido de e.g.value a e.target.value
                // ==================================================
                // FIN CORRECCIÓN
                // ==================================================
                required
                disabled={isLoading}
                className="h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button
            type="submit"
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando acceso...
              </>
            ) : (
              <>
                Acceder al Panel
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-between w-full text-sm">
            {/* ... (enlaces si los necesitas) ... */}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
