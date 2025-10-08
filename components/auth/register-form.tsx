"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react"

export function RegisterForm() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const register = async (data: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return await res.json()
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      setLoading(false)
      return
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role as "student" | "instructor",
        phone: formData.phone || undefined,
        specialization: formData.specialization || undefined,
        licenseNumber: formData.licenseNumber || undefined,
      })

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/login?message=registered")
        }, 2000)
      } else {
        setError(result.error || "Error al crear la cuenta")
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">¡Cuenta creada!</h2>
            <p className="text-muted-foreground">Tu cuenta ha sido creada exitosamente. Serás redirigido al login.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gradient">Crear Cuenta</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Únete a nuestra plataforma educativa dental
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="role">Tipo de cuenta</Label>
            <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Estudiante</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Datos extra si es instructor */}
          {formData.role === "instructor" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialization">Especialización</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleChange("specialization", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Número de Licencia</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
                  disabled={loading}
                />
              </div>
            </>
          )}

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Botón */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
          <Link href="/auth/login" className="text-primary hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
