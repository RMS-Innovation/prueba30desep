"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { formatAmountForDisplay } from "@/lib/stripe"
import { Check, Loader2, Crown, Star } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  price: number
  billing_interval: "monthly" | "yearly"
  features: string[]
  is_active: boolean
}

interface SubscriptionPlansProps {
  onSubscriptionComplete?: () => void
}

function SubscriptionCheckout({
  plan,
  onComplete,
  onCancel,
}: {
  plan: SubscriptionPlan
  onComplete?: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create subscription
      const response = await fetch("/api/payments/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
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
        onComplete?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error procesando el pago")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmar Suscripción</CardTitle>
        <CardDescription>
          Suscribiéndote al plan {plan.name} - {formatAmountForDisplay(plan.price, "usd")}/
          {plan.billing_interval === "monthly" ? "mes" : "año"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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

          <div className="flex space-x-2">
            <Button type="submit" disabled={!stripe || loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar Suscripción"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function SubscriptionPlans({ onSubscriptionComplete }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/subscription-plans")
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans)
      }
    } catch (error) {
      console.error("Error fetching plans:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Crown className="h-16 w-16 text-yellow-500 mx-auto" />
            <h3 className="text-xl font-semibold">¡Suscripción activada!</h3>
            <p className="text-muted-foreground">Ya tienes acceso completo a todos los cursos</p>
            <Button onClick={() => (window.location.href = "/dashboard")}>Ir al Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (selectedPlan) {
    return (
      <Elements stripe={stripePromise}>
        <SubscriptionCheckout
          plan={selectedPlan}
          onComplete={() => {
            setSuccess(true)
            onSubscriptionComplete?.()
          }}
          onCancel={() => setSelectedPlan(null)}
        />
      </Elements>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Elige tu Plan</h2>
        <p className="text-muted-foreground">Accede a todos los cursos con una suscripción</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.billing_interval === "yearly" ? "border-primary shadow-lg" : ""
            } hover:shadow-md transition-shadow`}
          >
            {plan.billing_interval === "yearly" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Más Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                <span className="text-2xl font-bold">{formatAmountForDisplay(plan.price, "usd")}</span>
              </CardTitle>
              <CardDescription>
                {plan.description}
                <br />
                <span className="text-sm">
                  Facturado {plan.billing_interval === "monthly" ? "mensualmente" : "anualmente"}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button onClick={() => setSelectedPlan(plan)} className="w-full">
                {plan.billing_interval === "yearly" ? "Ahorrar con Plan Anual" : "Comenzar Plan Mensual"}
              </Button>

              {plan.billing_interval === "yearly" && (
                <p className="text-xs text-center text-muted-foreground">
                  Ahorra {formatAmountForDisplay((plan.price / 12) * 14 - plan.price, "usd")} al año
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
