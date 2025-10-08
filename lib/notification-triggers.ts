import { whatsappService } from "./whatsapp"
import { createClient } from "./supabase"

interface TriggerData {
  userId: string
  courseName?: string
  amount?: number
  certificateId?: string
}

export async function triggerEnrollmentNotification(data: TriggerData) {
  const supabase = createClient()

  const { data: user } = await supabase
    .from("users")
    .select("phone, notification_preferences")
    .eq("id", data.userId)
    .single()

  if (user?.phone && user.notification_preferences?.whatsapp) {
    await whatsappService.sendEnrollmentNotification({
      userId: data.userId,
      phone: user.phone,
      type: "enrollment",
      data: { courseName: data.courseName },
    })
  }
}

export async function triggerCompletionNotification(data: TriggerData) {
  const supabase = createClient()

  const { data: user } = await supabase
    .from("users")
    .select("phone, notification_preferences")
    .eq("id", data.userId)
    .single()

  if (user?.phone && user.notification_preferences?.whatsapp) {
    await whatsappService.sendCompletionNotification({
      userId: data.userId,
      phone: user.phone,
      type: "completion",
      data: { courseName: data.courseName },
    })
  }
}

export async function triggerCertificateNotification(data: TriggerData) {
  const supabase = createClient()

  const { data: user } = await supabase
    .from("users")
    .select("phone, notification_preferences")
    .eq("id", data.userId)
    .single()

  if (user?.phone && user.notification_preferences?.whatsapp) {
    await whatsappService.sendCertificateNotification({
      userId: data.userId,
      phone: user.phone,
      type: "certificate",
      data: { courseName: data.courseName },
    })
  }
}

export async function triggerPaymentNotification(data: TriggerData) {
  const supabase = createClient()

  const { data: user } = await supabase
    .from("users")
    .select("phone, notification_preferences")
    .eq("id", data.userId)
    .single()

  if (user?.phone && user.notification_preferences?.whatsapp) {
    await whatsappService.sendPaymentNotification({
      userId: data.userId,
      phone: user.phone,
      type: "payment",
      data: { courseName: data.courseName, amount: data.amount },
    })
  }
}
