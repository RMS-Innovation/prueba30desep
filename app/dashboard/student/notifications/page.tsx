"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  BookOpen,
  Award,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Settings,
  Download,
} from "lucide-react"
import { StudentAvatar } from "@/components/ui/student-avatar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification,
} from "@/lib/notifications-storage"
import { downloadCertificateAsPDF } from "@/lib/certificate-download"

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    const loadNotifications = () => {
      setLoading(true)
      try {
        const loaded = getNotifications()
        setNotifications(loaded)
      } catch (error) {
        console.error("Error loading notifications:", error)
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
    markAsRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleCertificateDownload = async (notification: Notification) => {
    if (notification.type !== "certificate" || !notification.metadata?.courseId) return

    try {
      handleMarkAsRead(notification.id)

      const courseName = notification.message.match(/"([^"]+)"/)?.[1] || "Curso Completado"

      await downloadCertificateAsPDF({
        studentName: "Juan Pérez",
        courseTitle: courseName,
        instructor: "Dr. Ana López",
        issueDate: new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        certificateId: notification.metadata.certificateId || `CERT-${Date.now()}`,
        grade: "Excelente",
      })
    } catch (error) {
      console.error("[v0] Error downloading certificate:", error)
      alert("Error al descargar el certificado. Por favor, intenta desde la página de certificados.")
    }
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
                          {notification.type === "certificate" && notification.actionLabel === "Descargar" ? (
                            <Button
                              size="sm"
                              className="bg-purple-800 hover:bg-purple-900"
                              onClick={() => handleCertificateDownload(notification)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {notification.actionLabel}
                            </Button>
                          ) : notification.actionUrl ? (
                            <Link href={notification.actionUrl}>
                              <Button
                                size="sm"
                                className="bg-purple-800 hover:bg-purple-900"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                {notification.actionLabel || "Ver más"}
                              </Button>
                            </Link>
                          ) : null}
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
