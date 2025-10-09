"use client"

// Componente de barra lateral de navegación
// Muestra diferentes menús según el rol del usuario (estudiante, instructor, admin)
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  BarChart2,
  Users,
  Library,
  Settings,
  BadgeCheck,
  FileText,
  MessageSquare,
  Bell,
  ShieldCheck,
  Banknote,
  UserCircle,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Role = "student" | "instructor" | "admin"

export function Sidebar({ userRole }: { userRole: Role }) {
  const pathname = usePathname()
  const router = useRouter();

  // Menú de navegación para estudiantes
  const studentItems = [
    { label: "Inicio", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "Mis Cursos", href: "/dashboard/student/courses", icon: BookOpen },
    { label: "Certificados", href: "/dashboard/student/certificates", icon: CheckCircle2 },
    { label: "Mi Perfil", href: "/dashboard/student/profile", icon: UserCircle },
    { label: "Foros", href: "/dashboard/student/discussions", icon: MessageSquare },
    { label: "Notificaciones", href: "/dashboard/student/notifications", icon: Bell },
    { label: "Configuración", href: "/dashboard/student/settings", icon: Settings },
  ]

  // Menú de navegación para instructores
  const instructorItems = [
    { label: "Inicio", href: "/dashboard/instructor", icon: LayoutDashboard },
    { label: "Mis Cursos", href: "/dashboard/instructor/courses", icon: Library },
    { label: "Estudiantes", href: "/dashboard/instructor/students", icon: Users },
    { label: "Evaluaciones", href: "/dashboard/instructor/quizzes", icon: FileText },
    { label: "Reseñas", href: "/dashboard/instructor/reviews", icon: BadgeCheck },
    { label: "Analítica", href: "/dashboard/instructor/analytics", icon: BarChart2 },
    { label: "Configuración", href: "/dashboard/instructor/settings", icon: Settings },
  ]

  // Menú de navegación para administradores
  const adminItems = [
    { label: "Panel", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Usuarios", href: "/dashboard/admin/users", icon: Users },
    { label: "Cursos", href: "/dashboard/admin/courses", icon: Library },
    { label: "Pagos", href: "/dashboard/admin/payments", icon: Banknote },
    { label: "Moderación", href: "/dashboard/admin/moderation", icon: ShieldCheck },
    { label: "Analítica", href: "/dashboard/admin/analytics", icon: BarChart2 },
    { label: "Configuración", href: "/dashboard/admin/settings", icon: Settings },
  ]

  // Selecciona el menú apropiado según el rol del usuario
  const items = userRole === "student" ? studentItems : userRole === "instructor" ? instructorItems : adminItems
//MANEJO DE CIERRE DE SESION
const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login'); // Redirige al login
    router.refresh(); // Refresca la ruta para limpiar estado
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

  return (
    // Sidebar fijo en el lado izquierdo, oculto en móvil
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 shrink-0 border-r bg-white md:block">
      <div className="flex h-full flex-col">
        {/* Logo y nombre de la plataforma */}
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-700" />
            <span className="text-lg font-bold text-gray-900">Dental LMS</span>
          </Link>
        </div>

        {/* Navegación principal con scroll */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const Icon = item.icon
            // Determina si la ruta actual coincide con el item (exacta o subruta)
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  // Estilos diferentes para item activo vs inactivo
                  isActive ? "bg-purple-50 text-purple-900" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-purple-800" : "text-gray-500")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer con información del rol actual */}
        <div className="border-t p-3">
          <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>

          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            Sesión como:{" "}
            <span className="font-medium capitalize">{userRole === "admin" ? "Administrador" : userRole}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
