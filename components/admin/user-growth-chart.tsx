"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface UserGrowthChartProps {
  data: Array<{
    month: string
    students: number
    instructors: number
  }>
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #27272a",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#ededed" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6" }}
              name="Students"
            />
            <Line
              type="monotone"
              dataKey="instructors"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981" }}
              name="Instructors"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
