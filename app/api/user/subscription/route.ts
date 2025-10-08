import { type NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/session"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        subscription_plans (
          name,
          price,
          billing_interval
        )
      `)
      .eq("user_id", session.userId!)
      .in("status", ["active", "past_due", "unpaid"])
      .single()

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ message: "Error al obtener suscripción" }, { status: 500 })
    }

    return NextResponse.json({ subscription: subscription || null })
  } catch (error) {
    console.error("Get user subscription error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
