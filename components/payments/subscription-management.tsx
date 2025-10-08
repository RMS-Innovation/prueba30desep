"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { formatAmountForDisplay } from "@/lib/stripe"
import { Calendar, CreditCard, AlertTriangle, CheckCircle } from "lucide-react"

interface Subscription {
  id: string
  plan_id: string
  status: "active" | "canceled" | "past_due" | "unpaid"
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  subscription_plans: {
    name: string
    price: number
    billing_interval: "monthly" | "yearly"
  }
}

export function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/user/subscription")
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    setActionLoading(true)
    setError("")

    try {
      const response = await fetch("/api/user/subscription/cancel", {
        method: "POST",
      })

      if (response.ok) {
        await fetchSubscription()
      } else {
        const errorData = await response.json()
        setError(errorData.message)
      }
    } catch (err) {
      setError("Error al cancelar suscripción")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!subscription) return

    setActionLoading(true)
    setError("")

    try {
      const response = await fetch("/api/user/subscription/reactivate", {
        method: "POST",
      })

      if (response.ok) {
        await fetchSubscription()
      } else {
        const errorData = await response.json()
        setError(errorData.message)
      }
    } catch (err) {
      setError("Error al reactivar suscripción")
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (status === "active" && cancelAtPeriodEnd) {
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Se cancela al final del período
        </Badge>
      )
    }

    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activa
          </Badge>
        )
      case "canceled":
        return <Badge variant="destructive">Cancelada</Badge>
      case "past_due":
        return <Badge variant="destructive">Pago vencido</Badge>
      case "unpaid":
        return <Badge variant="destructive">Sin pagar</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-medium">No tienes suscripción activa</h3>
            <p className="text-muted-foreground">Suscríbete para acceder a todos los cursos</p>
            <Button onClick={() => (window.location.href = "/pricing")}>Ver Planes</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const plan = subscription.subscription_plans

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Mi Suscripción
          {getStatusBadge(subscription.status, subscription.cancel_at_period_end)}
        </CardTitle>
        <CardDescription>Gestiona tu suscripción y facturación</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Plan:</span>
            <span>{plan.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Precio:</span>
            <span>
              {formatAmountForDisplay(plan.price, "usd")}/{plan.billing_interval === "monthly" ? "mes" : "año"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Próximo pago:</span>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(subscription.current_period_end).toLocaleDateString("es-MX")}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          {subscription.status === "active" && !subscription.cancel_at_period_end && (
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              disabled={actionLoading}
              className="w-full bg-transparent"
            >
              {actionLoading ? "Cancelando..." : "Cancelar Suscripción"}
            </Button>
          )}

          {subscription.cancel_at_period_end && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Tu suscripción se cancelará el {new Date(subscription.current_period_end).toLocaleDateString("es-MX")}
                  . Aún tienes acceso hasta esa fecha.
                </AlertDescription>
              </Alert>
              <Button onClick={handleReactivateSubscription} disabled={actionLoading} className="w-full">
                {actionLoading ? "Reactivando..." : "Reactivar Suscripción"}
              </Button>
            </div>
          )}

          {["past_due", "unpaid"].includes(subscription.status) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Hay un problema con tu pago. Por favor actualiza tu método de pago para continuar con el acceso.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
