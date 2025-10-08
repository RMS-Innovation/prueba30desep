import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { whatsappService } from "@/lib/whatsapp"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, type, data } = await request.json()

    if (!userId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Get user phone number
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("phone, name")
      .eq("id", userId)
      .single()

    if (userError || !user?.phone) {
      return NextResponse.json({ error: "User phone not found" }, { status: 404 })
    }

    const notificationData = {
      userId,
      phone: user.phone,
      type,
      data,
    }

    let success = false

    switch (type) {
      case "enrollment":
        success = await whatsappService.sendEnrollmentNotification(notificationData)
        break
      case "completion":
        success = await whatsappService.sendCompletionNotification(notificationData)
        break
      case "certificate":
        success = await whatsappService.sendCertificateNotification(notificationData)
        break
      case "payment":
        success = await whatsappService.sendPaymentNotification(notificationData)
        break
      case "reminder":
        success = await whatsappService.sendReminderNotification(notificationData)
        break
      default:
        return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    if (success) {
      // Log notification in database
      await supabase.from("notifications").insert({
        user_id: userId,
        type,
        channel: "whatsapp",
        status: "sent",
        data,
        sent_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
