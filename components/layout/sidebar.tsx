"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Video,
  Award,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  MessageSquare,
  Bell,
} from "lucide-react"

interface SidebarProps {
  userRole: "student" | "instructor" | "admin"
}

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/dashboard/student", icon: BarChart3 },
    { name: "Mis Cursos", href: "/dashboard/student/courses", icon: BookOpen },
    { name: "Certificados", href: "/dashboard/student/certificates", icon: Award },
    { name: "Foros", href: "/dashboard/student/forums", icon: MessageSquare },
    { name: "Notificaciones", href: "/dashboard/student/notifications", icon: Bell },
    { name: "Perfil", href: "/dashboard/student/profile", icon: User },
    { name: "Configuración", href: "/dashboard/student/settings", icon: Settings },
  ],
  instructor: [
    { name: "Dashboard", href: "/dashboard/instructor", icon: BarChart3 },
    { name: "Mis Cursos", href: "/dashboard/instructor/courses", icon: BookOpen },
    { name: "Videos", href: "/dashboard/instructor/videos", icon: Video },
    { name: "Estudiantes", href: "/dashboard/instructor/students", icon: Users },
    { name: "Certificados", href: "/dashboard/instructor/certificates", icon: Award },
    { name: "Perfil", href: "/dashboard/instructor/profile", icon: User },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: BarChart3 },
    { name: "Usuarios", href: "/dashboard/admin/users", icon: Users },
    { name: "Cursos", href: "/dashboard/admin/courses", icon: BookOpen },
    { name: "Pagos", href: "/dashboard/admin/payments", icon: CreditCard },
    { name: "Certificados", href: "/dashboard/admin/certificates", icon: Award },
    { name: "Configuración", href: "/dashboard/admin/settings", icon: Settings },
  ],
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const items = navigationItems[userRole]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-800 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DentalEdu</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-purple-50 text-purple-800 border-r-2 border-purple-800"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User menu */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Cerrar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
