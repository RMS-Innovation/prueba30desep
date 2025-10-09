// Página de registro de nuevos usuarios (estudiantes e instructores)
// Recopila información básica y específica según el rol seleccionado
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    // Contenedor principal con diseño centrado y fondo degradado morado
    <div className="min-h-screen flex items-center justify-center gradient-purple p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Encabezado con logo y branding */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            {/* Icono de globo representando la plataforma global */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">Plataforma Educativa Dental</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Instituto Autónomo del Norte</p>
        </div>
        {/* Formulario de registro con campos dinámicos según el rol */}
        <RegisterForm />
      </div>
    </div>
  )
}
