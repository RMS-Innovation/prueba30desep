"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { formatAmountForDisplay } from "@/lib/stripe"
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Course {
  id: string
  title: string
  price: number
  short_description?: string
  thumbnail_url?: string
}

interface CoursePurchaseProps {
  course: Course
  onPurchaseComplete?: () => void
}

function CheckoutForm({ course, onPurchaseComplete }: CoursePurchaseProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create payment intent
      const response = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      const { clientSecret } = await response.json()

      // Confirm payment
      const cardElement = elements.getElement(CardElement)!
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (stripeError) {
        setError(stripeError.message || "Error en el pago")
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true)
        onPurchaseComplete?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error procesando el pago")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">¡Compra exitosa!</h3>
            <p className="text-muted-foreground">Ya tienes acceso al curso "{course.title}"</p>
            <Button onClick={() => (window.location.href = `/courses/${course.id}`)}>Ir al curso</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Comprar Curso</span>
        </CardTitle>
        <CardDescription>Completa tu compra para acceder al curso completo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Course Summary */}
          <div className="flex space-x-4 p-4 border rounded-lg">
            {course.thumbnail_url && (
              <img
                src={course.thumbnail_url || "/placeholder.svg"}
                alt={course.title}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h4 className="font-medium">{course.title}</h4>
              {course.short_description && <p className="text-sm text-muted-foreground">{course.short_description}</p>}
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary">Acceso de por vida</Badge>
                <span className="text-lg font-bold">{formatAmountForDisplay(course.price, "usd")}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Información de la tarjeta</label>
              <div className="p-3 border rounded-md">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Pago seguro procesado por Stripe</span>
            </div>
          </div>

          <Button type="submit" disabled={!stripe || loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              `Pagar ${formatAmountForDisplay(course.price, "usd")}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function CoursePurchase({ course, onPurchaseComplete }: CoursePurchaseProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm course={course} onPurchaseComplete={onPurchaseComplete} />
    </Elements>
  )
}
