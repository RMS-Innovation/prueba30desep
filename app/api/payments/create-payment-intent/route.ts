import { type NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/session"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getOrCreateStripeCustomer, createPaymentIntent } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ message: "ID del curso requerido" }, { status: 400 })
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

    // Get course info
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("title, price")
      .eq("id", courseId)
      .eq("is_published", true)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ message: "Curso no encontrado" }, { status: 404 })
    }

    // Check if user already purchased this course
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", session.userId!)
      .eq("course_id", courseId)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({ message: "Ya tienes acceso a este curso" }, { status: 409 })
    }

    // Create or get Stripe customer
    const customer = await getOrCreateStripeCustomer(
      session.userId!,
      user.email,
      `${user.first_name} ${user.last_name}`,
    )

    // Create payment intent
    const paymentIntent = await createPaymentIntent(course.price, "usd", customer.id, {
      userId: session.userId,
      courseId,
      courseName: course.title,
    })

    // Create payment record in database
    await supabase.from("payments").insert({
      user_id: session.userId!,
      course_id: courseId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: course.price,
      currency: "usd",
      status: "pending",
      payment_method: "stripe",
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: course.price,
      currency: "usd",
    })
  } catch (error) {
    console.error("Create payment intent error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
