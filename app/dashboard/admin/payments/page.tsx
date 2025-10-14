import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentsTable } from "@/components/admin/payments-table"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DollarSign, TrendingUp, RefreshCw, CheckCircle } from "lucide-react"

async function getPayments() {
  const supabase = await getSupabaseServerClient()

  const { data: payments, error } = await supabase
    .from("payments")
    .select(`
      *,
      users (
        email,
        first_name,
        last_name
      ),
      courses (
        title
      ),
      subscriptions (
        subscription_plans (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    return []
  }

  return payments || []
}

export default async function PaymentsPage() {
  const payments = await getPayments()

  const totalRevenue = payments
    .filter((p: any) => p.status === "succeeded")
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0)

  const successfulPayments = payments.filter((p: any) => p.status === "succeeded").length
  const refundedPayments = payments.filter((p: any) => p.status === "refunded").length
  const pendingPayments = payments.filter((p: any) => p.status === "pending").length

  const handleViewPayment = (paymentId: string) => {
    console.log("[v0] View payment:", paymentId)
  }

  const handleRefund = (paymentId: string) => {
    console.log("[v0] Refund payment:", paymentId)
  }

  const handleDownloadInvoice = (paymentId: string) => {
    console.log("[v0] Download invoice:", paymentId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">Monitor and manage all payment transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulPayments}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <RefreshCw className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refundedPayments}</div>
            <p className="text-xs text-muted-foreground">Refund requests</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>View and manage all payment transactions and refunds</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsTable
            payments={payments}
            onViewPayment={handleViewPayment}
            onRefund={handleRefund}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </CardContent>
      </Card>
    </div>
  )
}
