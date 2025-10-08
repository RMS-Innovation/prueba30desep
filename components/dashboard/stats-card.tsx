import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && (
              <p className={`text-sm mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "+" : ""}
                {trend.value}% vs mes anterior
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-purple-800" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
