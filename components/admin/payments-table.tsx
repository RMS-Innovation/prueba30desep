"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Eye, Download, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  payment_method: string | null
  created_at: string
  users: {
    email: string
    first_name: string
    last_name: string
  }
  courses: {
    title: string
  } | null
  subscriptions: {
    subscription_plans: {
      name: string
    }
  } | null
}

interface PaymentsTableProps {
  payments: Payment[]
  onViewPayment: (paymentId: string) => void
  onRefund: (paymentId: string) => void
  onDownloadInvoice: (paymentId: string) => void
}

export function PaymentsTable({ payments, onViewPayment, onRefund, onDownloadInvoice }: PaymentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.users.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${payment.users.first_name} ${payment.users.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            Succeeded
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="default" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            Failed
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="default" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
            Refunded
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="default" className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">
            Canceled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="succeeded">Succeeded</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {payment.users.first_name} {payment.users.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{payment.users.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {payment.courses ? (
                    <div>
                      <p className="text-sm font-medium">Course</p>
                      <p className="text-sm text-muted-foreground">{payment.courses.title}</p>
                    </div>
                  ) : payment.subscriptions ? (
                    <div>
                      <p className="text-sm font-medium">Subscription</p>
                      <p className="text-sm text-muted-foreground">{payment.subscriptions.subscription_plans.name}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell className="font-mono font-medium">
                  {payment.currency.toUpperCase()} ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">{payment.payment_method || "N/A"}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewPayment(payment.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownloadInvoice(payment.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </DropdownMenuItem>
                      {payment.status === "succeeded" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onRefund(payment.id)}>
                            <RefreshCw className="mr-2 h-4 w-4 text-orange-500" />
                            Issue Refund
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          No payments found matching your criteria.
        </div>
      )}
    </div>
  )
}
