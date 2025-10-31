export interface Notification {
  id: string
  type: "course" | "certificate" | "payment" | "forum" | "system"
  title: string
  message: string
  createdAt: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  metadata?: {
    courseId?: number
    certificateId?: string
    forumId?: number
    [key: string]: any
  }
}

const STORAGE_KEY = "dental_platform_notifications"

export function getNotifications(): Notification[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultNotifications()

    const notifications = JSON.parse(stored)
    return notifications.map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt),
    }))
  } catch (error) {
    console.error("Error loading notifications:", error)
    return getDefaultNotifications()
  }
}

export function saveNotifications(notifications: Notification[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  } catch (error) {
    console.error("Error saving notifications:", error)
  }
}

export function addNotification(notification: Omit<Notification, "id" | "createdAt" | "read">): void {
  const notifications = getNotifications()
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    createdAt: new Date(),
    read: false,
  }

  notifications.unshift(newNotification)
  saveNotifications(notifications)
}

export function markAsRead(id: string): void {
  const notifications = getNotifications()
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  saveNotifications(updated)
}

export function markAllAsRead(): void {
  const notifications = getNotifications()
  const updated = notifications.map((n) => ({ ...n, read: true }))
  saveNotifications(updated)
}

export function deleteNotification(id: string): void {
  const notifications = getNotifications()
  const filtered = notifications.filter((n) => n.id !== id)
  saveNotifications(filtered)
}

export function getUnreadCount(): number {
  const notifications = getNotifications()
  return notifications.filter((n) => !n.read).length
}

function getDefaultNotifications(): Notification[] {
  return [
    {
      id: "1",
      type: "course",
      title: "Nuevo módulo disponible",
      message: 'Se ha agregado un nuevo módulo al curso "Técnicas de Endodoncia"',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      actionUrl: "/dashboard/student/course/2",
      actionLabel: "Ver curso",
      metadata: { courseId: 2 },
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
      metadata: { courseId: 3, certificateId: "cert-3" },
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
      metadata: { forumId: 1 },
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
      metadata: { courseId: 1 },
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
}
