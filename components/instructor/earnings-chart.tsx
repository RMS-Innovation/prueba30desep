"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface EarningsChartProps {
  data: Array<{
    month: string
    earnings: number
  }>
}

export function EarningsChart({ data }: EarningsChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No earnings data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Earnings"]}
        />
        <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
