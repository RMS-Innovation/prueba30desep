import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/instructor/stat-card"
import { DollarSign, TrendingUp, CreditCard } from "lucide-react"
import { EarningsChart } from "@/components/instructor/earnings-chart"
import { PaymentHistory } from "@/components/instructor/payment-history"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function InstructorEarningsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: instructor } = await supabase.from("instructors").select("*").eq("user_id", user.id).single()

  if (!instructor) {
    redirect("/login")
  }

  // Get all payments for this instructor
  const { data: payments } = await supabase
    .from("payments")
    .select(
      `
      *,
      enrollment:enrollments!inner(
        id,
        student:students(
          id,
          first_name,
          last_name
        ),
        course:courses!inner(
          id,
          title,
          price,
          instructor_id
        )
      )
    `,
    )
    .eq("enrollment.course.instructor_id", instructor.id)
    .order("payment_date", { ascending: false })

  // Calculate earnings stats
  const totalEarnings = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
  const thisMonthEarnings =
    payments
      ?.filter((p) => {
        const paymentDate = new Date(p.payment_date)
        const now = new Date()
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0

  const pendingPayouts =
    payments?.filter((p) => p.status === "completed" && !p.payout_date).reduce((sum, p) => sum + Number(p.amount), 0) ||
    0

  // Calculate monthly earnings for chart - CORREGIDO
  const monthlyEarnings = payments?.reduce(
    (acc: Record<string, number>, payment) => {
      const date = new Date(payment.payment_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      acc[monthKey] = (acc[monthKey] || 0) + Number(payment.amount)
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(monthlyEarnings || {})
    .sort()
    .slice(-6)
    .map(([month, amount]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      earnings: amount as number, // Asegurar que es number
    }))

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Earnings</h1>
              <p className="text-muted-foreground mt-1">Track your revenue and payment history</p>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <StatCard title="Total Earnings" value={`$${totalEarnings.toFixed(2)}`} icon={DollarSign} />
            <StatCard title="This Month" value={`$${thisMonthEarnings.toFixed(2)}`} icon={TrendingUp} />
            <StatCard title="Pending Payout" value={`$${pendingPayouts.toFixed(2)}`} icon={CreditCard} />
          </div>

          {/* Earnings Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <EarningsChart data={chartData} />
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentHistory payments={payments || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}