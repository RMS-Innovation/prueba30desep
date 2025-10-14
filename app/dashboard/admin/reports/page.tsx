import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  const reports = [
    {
      title: "Monthly Revenue Report",
      description: "Detailed breakdown of revenue by course and subscription",
      date: "June 2024",
      type: "Financial",
    },
    {
      title: "User Activity Report",
      description: "User engagement metrics and activity patterns",
      date: "June 2024",
      type: "Analytics",
    },
    {
      title: "Course Performance Report",
      description: "Enrollment, completion, and rating statistics",
      date: "June 2024",
      type: "Academic",
    },
    {
      title: "Instructor Performance Report",
      description: "Instructor ratings, earnings, and student feedback",
      date: "June 2024",
      type: "Academic",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and download detailed platform reports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report, index) => (
          <Card key={index} className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{report.date}</p>
                  <p className="text-xs text-muted-foreground">{report.type}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
