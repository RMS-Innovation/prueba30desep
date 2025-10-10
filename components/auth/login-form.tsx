"use client"

// Componente de formulario de inicio de sesión
// Maneja la autenticación de usuarios y redirección según su rol
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-utils"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  // Estado para controlar el montaje del componente (evita errores de hidratación)
  const [mounted, setMounted] = useState(false)

  // Estados del formulario
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // Controla visibilidad de contraseña
  const [error, setError] = useState("") // Mensajes de error
  const [loading, setLoading] = useState(false) // Estado de carga durante autenticación

  // Hooks de Next.js para navegación y autenticación
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL de redirección después del login (por defecto /dashboard)
  const redirectTo = searchParams?.get("redirect") || "/dashboard"

  // Efecto para marcar el componente como montado
  useEffect(() => {
    setMounted(true)
  }, [])

  // Maneja el envío del formulario de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("[v0] Attempting login with:", { email, password: "***" })

    try {
      // Llama a la función de login del hook de autenticación
      const result = await login(email, password)
      console.log("[v0] Login result:", result)

      if (result.success) {
        console.log("[v0] Login successful, redirecting to:", redirectTo)
        // Redirige al dashboard correspondiente según el rol del usuario
        router.push(redirectTo)
      } else {
        console.log("[v0] Login failed:", result.error)
        setError(result.error || "Error al iniciar sesión")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

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
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">Ingresa tus credenciales para acceder a la plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Muestra mensaje de error si existe */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Campo de email */}
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

          {/* Campo de contraseña con botón para mostrar/ocultar */}
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
             
            </div>
          </div>

          {/* Botón de envío con estado de carga */}
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

        {/* Enlace a página de registro */}
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">¿No tienes cuenta? </span>
          <Link href="/auth/register" className="text-primary hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
