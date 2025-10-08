interface WhatsAppMessage {
  to: string
  type: "text" | "template"
  text?: {
    body: string
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: Array<{
      type: string
      parameters: Array<{
        type: string
        text: string
      }>
    }>
  }
}

interface NotificationData {
  userId: string
  phone: string
  type: "enrollment" | "completion" | "certificate" | "payment" | "reminder"
  data: Record<string, any>
}

export class WhatsAppService {
  private apiUrl = "https://graph.facebook.com/v18.0"
  private accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    if (!this.accessToken || !this.phoneNumberId) {
      console.error("WhatsApp credentials not configured")
      return false
    }

    try {
      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("WhatsApp API error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
      return false
    }
  }

  async sendEnrollmentNotification(data: NotificationData): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: data.phone,
      type: "text",
      text: {
        body: `¡Hola! Te has inscrito exitosamente en el curso "${data.data.courseName}". ¡Comienza tu aprendizaje ahora! 🦷📚`,
      },
    }

    return this.sendMessage(message)
  }

  async sendCompletionNotification(data: NotificationData): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: data.phone,
      type: "text",
      text: {
        body: `¡Felicidades! Has completado el curso "${data.data.courseName}". Tu certificado estará disponible pronto. 🎉🏆`,
      },
    }

    return this.sendMessage(message)
  }

  async sendCertificateNotification(data: NotificationData): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: data.phone,
      type: "text",
      text: {
        body: `¡Tu certificado de "${data.data.courseName}" está listo! Descárgalo desde tu dashboard. 📜✨`,
      },
    }

    return this.sendMessage(message)
  }

  async sendPaymentNotification(data: NotificationData): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: data.phone,
      type: "text",
      text: {
        body: `Pago confirmado por $${data.data.amount} para "${data.data.courseName}". ¡Gracias por tu confianza! 💳✅`,
      },
    }

    return this.sendMessage(message)
  }

  async sendReminderNotification(data: NotificationData): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: data.phone,
      type: "text",
      text: {
        body: `¡No olvides continuar con tu curso "${data.data.courseName}"! Te esperamos para seguir aprendiendo. 📖⏰`,
      },
    }

    return this.sendMessage(message)
  }
}

export const whatsappService = new WhatsAppService()
