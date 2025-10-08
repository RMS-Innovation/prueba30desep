import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createServerSupabaseClient } from "@/lib/supabase"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update payment status
        const { error: paymentError } = await supabase
          .from("payments")
          .update({ status: "succeeded" })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        if (paymentError) {
          console.error("Error updating payment:", paymentError)
          break
        }

        // Get payment info to create enrollment
        const { data: payment } = await supabase
          .from("payments")
          .select("user_id, course_id")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .single()

        if (payment && payment.course_id) {
          // Create enrollment
          await supabase.from("enrollments").insert({
            student_id: payment.user_id,
            course_id: payment.course_id,
          })

          // TODO: Send enrollment confirmation email/notification
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await supabase.from("payments").update({ status: "failed" }).eq("stripe_payment_intent_id", paymentIntent.id)

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)

          await supabase
            .from("subscriptions")
            .update({
              status: "active",
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id)

          // TODO: Send subscription confirmation notification
        }

        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          await supabase
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription as string)

          // TODO: Send payment failed notification
        }

        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status as any,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("stripe_subscription_id", subscription.id)

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)

        // TODO: Send subscription cancellation notification

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: "Webhook error" }, { status: 500 })
  }
}
