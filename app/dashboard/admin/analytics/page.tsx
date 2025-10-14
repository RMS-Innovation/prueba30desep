import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnrollmentChart } from "@/components/admin/enrollment-chart"
import { UserGrowthChart } from "@/components/admin/user-growth-chart"
import { CategoryDistribution } from "@/components/admin/category-distribution"
import { PlatformMetrics } from "@/components/admin/platform-metrics"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { TrendingUp, Users, BookOpen, DollarSign } from "lucide-react"

async function getAnalyticsData() {
  const supabase = await getSupabaseServerClient()

  // Get total users
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  // Get total courses
  const { count: totalCourses } = await supabase.from("courses").select("*", { count: "exact", head: true })

  // Get total enrollments
  const { count: totalEnrollments } = await supabase.from("enrollments").select("*", { count: "exact", head: true })

  // Get completed enrollments
  const { count: completedEnrollments } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  // Get total revenue
  const { data: payments } = await supabase.from("payments").select("amount").eq("status", "succeeded")

  const totalRevenue = payments?.reduce((sum: number, p: { amount: number | string }) => sum + Number(p.amount), 0) || 0

  // Get category distribution
  const { data: categories } = await supabase.from("categories").select("name, course_count")

  const categoryData =
    categories?.map((cat: { name: string; course_count: number | null }) => ({
      name: cat.name,
      value: cat.course_count || 0,
    })) || []

  return {
    totalUsers: totalUsers || 0,
    totalCourses: totalCourses || 0,
    totalEnrollments: totalEnrollments || 0,
    completedEnrollments: completedEnrollments || 0,
    totalRevenue,
    categoryData,
  }
}

// Mock data for charts - replace with real data
function getEnrollmentData() {
  return [
    { month: "Jan", enrollments: 245, completions: 180 },
    { month: "Feb", enrollments: 312, completions: 220 },
    { month: "Mar", enrollments: 389, completions: 285 },
    { month: "Apr", enrollments: 456, completions: 340 },
    { month: "May", enrollments: 523, completions: 410 },
    { month: "Jun", enrollments: 598, completions: 475 },
  ]
}

function getUserGrowthData() {
  return [
    { month: "Jan", students: 1200, instructors: 45 },
    { month: "Feb", students: 1450, instructors: 52 },
    { month: "Mar", students: 1680, instructors: 58 },
    { month: "Apr", students: 1920, instructors: 65 },
    { month: "May", students: 2180, instructors: 71 },
    { month: "Jun", students: 2450, instructors: 78 },
  ]
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData()
  const enrollmentData = getEnrollmentData()
  const userGrowthData = getUserGrowthData()

  const completionRate = analytics.totalEnrollments
    ? ((analytics.completedEnrollments / analytics.totalEnrollments) * 100).toFixed(1)
    : "0"

  const platformMetrics = [
    {
      label: "Course Completion Rate",
      value: analytics.completedEnrollments,
      total: analytics.totalEnrollments,
      color: "#3b82f6",
    },
    {
      label: "Active Users",
      value: Math.floor(analytics.totalUsers * 0.75),
      total: analytics.totalUsers,
      color: "#10b981",
    },
    {
      label: "Published Courses",
      value: Math.floor(analytics.totalCourses * 0.85),
      total: analytics.totalCourses,
      color: "#f59e0b",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground">Comprehensive insights into platform performance and user behavior</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEnrollments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">+3.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EnrollmentChart data={enrollmentData} />
        <UserGrowthChart data={userGrowthData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDistribution data={analytics.categoryData} />
        <PlatformMetrics metrics={platformMetrics} />
      </div>

      {/* Additional Reports */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download detailed reports for further analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">User Report</CardTitle>
                <CardDescription>Complete user data and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Download CSV
                </button>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Revenue Report</CardTitle>
                <CardDescription>Financial transactions and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Download CSV
                </button>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Course Report</CardTitle>
                <CardDescription>Course performance and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Download CSV
                </button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
