import { Suspense } from "react"
import { AdminLoginForm } from "@/components/auth/admin-login-form"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">DentalEdu Admin</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Panel de
              <br />
              Administración
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Gestiona usuarios, cursos, pagos y toda la plataforma desde un solo lugar.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">Sistema Operativo</span>
            </div>
            <span className="text-sm">•</span>
            <span className="text-sm">99.9% Uptime</span>
          </div>
          <p className="text-sm text-gray-500">Acceso restringido solo para administradores autorizados</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">DentalEdu</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
          </div>

          <Suspense fallback={<div className="text-center">Cargando...</div>}>
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
