import { Suspense } from "react"
import { AdminLoginForm } from "@/components/auth/admin-login-form"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Panel de Administración</h2>
          <p className="mt-2 text-sm text-gray-600">Acceso exclusivo para administradores</p>
        </div>
        <Suspense fallback={<div>Cargando...</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  )
}
