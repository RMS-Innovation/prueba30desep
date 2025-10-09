// Página de inicio de sesión para la plataforma educativa dental
// Permite a estudiantes, instructores y administradores acceder al sistema
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    // Contenedor principal con diseño centrado y fondo degradado
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Encabezado con branding de la plataforma */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plataforma Educativa Dental</h1>
          <p className="text-gray-600">Instituto Autónomo del Norte</p>
        </div>
        {/* Componente de formulario de login con validación y manejo de errores */}
        <LoginForm />
      </div>
    </div>
  )
}
