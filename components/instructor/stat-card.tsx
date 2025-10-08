import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trend.isPositive ? "text-accent" : "text-destructive"}`}>
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
