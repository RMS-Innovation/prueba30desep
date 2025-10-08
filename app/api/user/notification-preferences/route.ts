import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { createClient } from "@/lib/supabase"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { preferences, phone } = await request.json()

    const supabase = createClient()

    const { error } = await supabase
      .from("users")
      .update({
        notification_preferences: preferences,
        phone: phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)

    if (error) {
      console.error("Error updating notification preferences:", error)
      return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating notification preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    const { data: user, error } = await supabase
      .from("users")
      .select("notification_preferences, phone")
      .eq("id", session.user.id)
      .single()

    if (error) {
      console.error("Error fetching notification preferences:", error)
      return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
    }

    return NextResponse.json({
      preferences: user.notification_preferences || { email: true, whatsapp: false, push: true },
      phone: user.phone,
    })
  } catch (error) {
    console.error("Error fetching notification preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
