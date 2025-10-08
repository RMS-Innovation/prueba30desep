import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook signature (implement based on WhatsApp webhook verification)
    const signature = request.headers.get("x-hub-signature-256")
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    // Process webhook events
    if (body.entry && body.entry[0] && body.entry[0].changes) {
      const changes = body.entry[0].changes[0]

      if (changes.field === "messages") {
        const messages = changes.value.messages
        const statuses = changes.value.statuses

        const supabase = createClient()

        // Handle message status updates
        if (statuses) {
          for (const status of statuses) {
            await supabase
              .from("notifications")
              .update({
                status: status.status,
                updated_at: new Date().toISOString(),
              })
              .eq("whatsapp_message_id", status.id)
          }
        }

        // Handle incoming messages (optional - for replies)
        if (messages) {
          for (const message of messages) {
            // Log incoming message if needed
            console.log("Received WhatsApp message:", message)
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Webhook verification for WhatsApp
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge)
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
