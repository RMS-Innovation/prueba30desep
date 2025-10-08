import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Payment {
  id: string
  amount: string
  payment_date: string
  status: string
  payout_date?: string
  enrollment: {
    student: {
      id: string
      first_name: string
      last_name: string
    }
    course: {
      title: string
      price: string
    }
  }
}

interface PaymentHistoryProps {
  payments: Payment[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No payment history yet</p>
      </div>
    )
  }

  const getStatusBadge = (status: string, payoutDate?: string) => {
    if (payoutDate) {
      return <Badge variant="default">Paid Out</Badge>
    }
    if (status === "completed") {
      return <Badge variant="outline">Pending Payout</Badge>
    }
    if (status === "pending") {
      return <Badge variant="secondary">Pending</Badge>
    }
    return <Badge variant="secondary">{status}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {payment.enrollment.student.first_name[0]}
                {payment.enrollment.student.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                {payment.enrollment.student.first_name} {payment.enrollment.student.last_name}
              </p>
              <p className="text-sm text-muted-foreground truncate">{payment.enrollment.course.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(payment.payment_date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-foreground">${Number(payment.amount).toFixed(2)}</p>
              {payment.payout_date && (
                <p className="text-xs text-muted-foreground">Paid {formatDate(payment.payout_date)}</p>
              )}
            </div>
            {getStatusBadge(payment.status, payment.payout_date)}
          </div>
        </div>
      ))}
    </div>
  )
}
