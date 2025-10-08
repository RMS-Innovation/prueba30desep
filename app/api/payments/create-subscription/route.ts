import { type NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/session"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getOrCreateStripeCustomer, createSubscription } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json({ message: "ID del plan requerido" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get user info
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("first_name, last_name, email")
      .eq("id", session.userId!)
      .single()

    if (userError || !user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // Get subscription plan
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .eq("is_active", true)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ message: "Plan no encontrado" }, { status: 404 })
    }

    if (!plan.stripe_price_id) {
      return NextResponse.json({ message: "Plan no configurado correctamente" }, { status: 500 })
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", session.userId!)
      .eq("status", "active")
      .single()

    if (existingSubscription) {
      return NextResponse.json({ message: "Ya tienes una suscripción activa" }, { status: 409 })
    }

    // Create or get Stripe customer
    const customer = await getOrCreateStripeCustomer(
      session.userId!,
      user.email,
      `${user.first_name} ${user.last_name}`,
    )

    // Create subscription
    const subscription = await createSubscription(customer.id, plan.stripe_price_id)

    // Create subscription record in database
    await supabase.from("subscriptions").insert({
      user_id: session.userId!,
      plan_id: planId,
      stripe_subscription_id: subscription.id,
      status: "active",
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })

    const invoice = subscription.latest_invoice as any
    const paymentIntent = invoice.payment_intent

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
      amount: plan.price,
      currency: "usd",
    })
  } catch (error) {
    console.error("Create subscription error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
