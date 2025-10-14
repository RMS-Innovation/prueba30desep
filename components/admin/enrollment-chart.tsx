"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface EnrollmentChartProps {
  data: Array<{
    month: string
    enrollments: number
    completions: number
  }>
}

export function EnrollmentChart({ data }: EnrollmentChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Enrollment & Completion Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Bar dataKey="enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Enrollments" />
            <Bar dataKey="completions" fill="#10b981" radius={[4, 4, 0, 0]} name="Completions" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
