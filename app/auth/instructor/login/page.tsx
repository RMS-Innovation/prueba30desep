import { Suspense } from "react"
import { InstructorLoginForm } from "@/components/auth/instructor-login-form"

export default function InstructorLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Portal de Instructores</h2>
          <p className="mt-2 text-sm text-gray-600">Accede a tu panel de instructor</p>
        </div>
        <Suspense fallback={<div>Cargando...</div>}>
          <InstructorLoginForm />
        </Suspense>
      </div>
    </div>
  )
}
