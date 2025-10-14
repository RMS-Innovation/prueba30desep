import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Metric {
  label: string
  value: number
  total: number
  color: string
}

interface PlatformMetricsProps {
  metrics: Metric[]
}

export function PlatformMetrics({ metrics }: PlatformMetricsProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Platform Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => {
          const percentage = (metric.value / metric.total) * 100
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground">
                  {metric.value} / {metric.total}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% completion rate</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
