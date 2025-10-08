"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, GraduationCap } from "lucide-react"

export function InstructorLoginForm() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full max-w-md mx-auto p-6">Cargando...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/instructor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const redirectTo = searchParams.get("redirect") || "/dashboard/instructor"
        router.push(redirectTo)
      } else {
        setError(data.error || "Error al iniciar sesión")
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Instructor</CardTitle>
        <CardDescription className="text-center">Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="instructor@dentaledu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
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
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              ¿Eres estudiante? Inicia sesión aquí
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
