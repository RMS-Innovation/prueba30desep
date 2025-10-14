import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscriptionsTable } from "@/components/admin/subscriptions-table"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Users, CheckCircle, Clock, XCircle } from "lucide-react"

async function getSubscriptions() {
  const supabase = await getSupabaseServerClient()

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select(`
      *,
      students (
        users (
          email,
          first_name,
          last_name
        )
      ),
      subscription_plans (
        name,
        price,
        billing_interval
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching subscriptions:", error)
    return []
  }

  return subscriptions || []
}

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions()

  const activeSubscriptions = subscriptions.filter((s: any) => s.status === "active").length
  const trialingSubscriptions = subscriptions.filter((s: any) => s.status === "trialing").length
  const canceledSubscriptions = subscriptions.filter((s: any) => s.status === "canceled").length
  const pastDueSubscriptions = subscriptions.filter((s: any) => s.status === "past_due").length

  const handleViewSubscription = (subscriptionId: string) => {
    console.log("[v0] View subscription:", subscriptionId)
  }

  const handleCancelSubscription = (subscriptionId: string) => {
    console.log("[v0] Cancel subscription:", subscriptionId)
  }

  const handlePauseSubscription = (subscriptionId: string) => {
    console.log("[v0] Pause subscription:", subscriptionId)
  }

  const handleResumeSubscription = (subscriptionId: string) => {
    console.log("[v0] Resume subscription:", subscriptionId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">Monitor and manage all subscription plans and billing</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Active subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trialing</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialingSubscriptions}</div>
            <p className="text-xs text-muted-foreground">In trial period</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Due</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastDueSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Payment issues</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{canceledSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Canceled plans</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
          <CardDescription>View and manage all subscription plans and billing cycles</CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionsTable
            subscriptions={subscriptions}
            onViewSubscription={handleViewSubscription}
            onCancelSubscription={handleCancelSubscription}
            onPauseSubscription={handlePauseSubscription}
            onResumeSubscription={handleResumeSubscription}
          />
        </CardContent>
      </Card>
    </div>
  )
}
