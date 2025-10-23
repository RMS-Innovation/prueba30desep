"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BookOpen, Award, CreditCard, MessageSquare, CheckCircle2, Trash2, Settings } from "lucide-react"
import { StudentAvatar } from "@/components/ui/student-avatar"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "course" | "certificate" | "payment" | "forum" | "system"
  title: string
  message: string
  createdAt: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "course",
      title: "Nuevo módulo disponible",
      message: 'Se ha agregado un nuevo módulo al curso "Técnicas de Endodoncia"',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      actionUrl: "/dashboard/student/course/2",
      actionLabel: "Ver curso",
    },
    {
      id: "2",
      type: "certificate",
      title: "¡Certificado listo!",
      message: 'Tu certificado de "Prostodoncia Digital" está disponible para descargar',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionUrl: "/dashboard/student/certificates",
      actionLabel: "Descargar",
    },
    {
      id: "3",
      type: "forum",
      title: "Nueva respuesta en el foro",
      message: 'Alguien respondió a tu pregunta en "¿Cuál es la mejor técnica para preparación de conductos?"',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
      actionUrl: "/dashboard/student/forums/1",
      actionLabel: "Ver discusión",
    },
    {
      id: "4",
      type: "payment",
      title: "Pago procesado exitosamente",
      message: "Tu pago de $299.00 MXN ha sido procesado correctamente",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "5",
      type: "course",
      title: "Recordatorio de curso",
      message: 'Llevas 3 días sin avanzar en "Anatomía Dental Avanzada". ¡Continúa tu aprendizaje!',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: "/dashboard/student/course/1",
      actionLabel: "Continuar",
    },
    {
      id: "6",
      type: "system",
      title: "Actualización del sistema",
      message: "Hemos mejorado la plataforma con nuevas funcionalidades. ¡Descúbrelas!",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ]

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setNotifications(mockNotifications)
      } catch (error) {
        console.error("Error loading notifications:", error)
        setNotifications(mockNotifications)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-5 h-5 text-blue-600" />
      case "certificate":
        return <Award className="w-5 h-5 text-purple-600" />
      case "payment":
        return <CreditCard className="w-5 h-5 text-green-600" />
      case "forum":
        return <MessageSquare className="w-5 h-5 text-orange-600" />
      case "system":
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "hace un momento"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `hace ${hours} hora${hours > 1 ? "s" : ""}`
    const days = Math.floor(hours / 24)
    return `hace ${days} día${days > 1 ? "s" : ""}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar userRole="student" />
        <div className="md:ml-64">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <StudentAvatar size="lg" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
                  <p className="text-gray-600">
                    Mantente al día con tus cursos y actividades
                    {unreadCount > 0 && <Badge className="ml-2 bg-purple-600">{unreadCount} nuevas</Badge>}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="outline" onClick={handleMarkAllAsRead}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Marcar todas como leídas
                  </Button>
                )}
                <Link href="/dashboard/student/settings">
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">No leídas ({unreadCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === "unread" ? "No tienes notificaciones sin leer" : "No tienes notificaciones"}
                  </h3>
                  <p className="text-gray-600">
                    {filter === "unread"
                      ? "¡Excelente! Estás al día con todas tus notificaciones"
                      : "Cuando tengas nuevas actualizaciones, aparecerán aquí"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "transition-all hover:shadow-md",
                    !notification.read && "border-l-4 border-l-purple-600 bg-purple-50/30",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            !notification.read ? "bg-white" : "bg-gray-100",
                          )}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <h3
                              className={cn(
                                "text-base font-semibold mb-1",
                                !notification.read ? "text-gray-900" : "text-gray-700",
                              )}
                            >
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <p className="text-xs text-gray-500">{getTimeAgo(notification.createdAt)}</p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-purple-600 rounded-full ml-2 mt-2"></div>}
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          {notification.actionUrl && (
                            <Link href={notification.actionUrl}>
                              <Button
                                size="sm"
                                className="bg-purple-800 hover:bg-purple-900"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                {notification.actionLabel || "Ver más"}
                              </Button>
                            </Link>
                          )}
                          {!notification.read && (
                            <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(notification.id)}>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Marcar como leída
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
