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
import { MoreHorizontal, Search, Eye, XCircle, Pause, Play } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDistanceToNow, format } from "date-fns"

interface Subscription {
  id: string
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  students: {
    users: {
      email: string
      first_name: string
      last_name: string
    }
  }
  subscription_plans: {
    name: string
    price: number
    billing_interval: string
  }
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[]
  onViewSubscription: (subscriptionId: string) => void
  onCancelSubscription: (subscriptionId: string) => void
  onPauseSubscription: (subscriptionId: string) => void
  onResumeSubscription: (subscriptionId: string) => void
}

export function SubscriptionsTable({
  subscriptions,
  onViewSubscription,
  onCancelSubscription,
  onPauseSubscription,
  onResumeSubscription,
}: SubscriptionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.students.users.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${subscription.students.users.first_name} ${subscription.students.users.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            Active
          </Badge>
        )
      case "trialing":
        return (
          <Badge variant="default" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            Trialing
          </Badge>
        )
      case "past_due":
        return (
          <Badge variant="default" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
            Past Due
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="default" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            Canceled
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="default" className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">
            Paused
          </Badge>
        )
      case "unpaid":
        return (
          <Badge variant="default" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            Unpaid
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
            placeholder="Search subscriptions by user name or email..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trialing">Trialing</SelectItem>
            <SelectItem value="past_due">Past Due</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Student</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Period</TableHead>
              <TableHead>Next Billing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {subscription.students.users.first_name} {subscription.students.users.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{subscription.students.users.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{subscription.subscription_plans.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${subscription.subscription_plans.price}/{subscription.subscription_plans.billing_interval}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {getStatusBadge(subscription.status)}
                    {subscription.cancel_at_period_end && (
                      <Badge variant="outline" className="text-xs">
                        Canceling
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {subscription.current_period_start
                    ? format(new Date(subscription.current_period_start), "MMM d, yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {subscription.current_period_end ? (
                    <div>
                      <p>{format(new Date(subscription.current_period_end), "MMM d, yyyy")}</p>
                      <p className="text-xs">
                        {formatDistanceToNow(new Date(subscription.current_period_end), { addSuffix: true })}
                      </p>
                    </div>
                  ) : (
                    "N/A"
                  )}
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
                      <DropdownMenuItem onClick={() => onViewSubscription(subscription.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {subscription.status === "active" && (
                        <>
                          <DropdownMenuItem onClick={() => onPauseSubscription(subscription.id)}>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause Subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCancelSubscription(subscription.id)}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Cancel Subscription
                          </DropdownMenuItem>
                        </>
                      )}
                      {subscription.status === "paused" && (
                        <DropdownMenuItem onClick={() => onResumeSubscription(subscription.id)}>
                          <Play className="mr-2 h-4 w-4 text-green-500" />
                          Resume Subscription
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          No subscriptions found matching your criteria.
        </div>
      )}
    </div>
  )
}
