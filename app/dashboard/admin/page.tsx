import { StatsCard } from "@/components/admin/stats-card"
import { RecentActivity } from "@/components/admin/recent-activity"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { TopCourses } from "@/components/admin/top-courses"
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Award } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"

async function getDashboardStats() {
  const supabase = await getSupabaseServerClient()

  // Get total users count
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  // Get total students
  const { count: totalStudents } = await supabase.from("students").select("*", { count: "exact", head: true })

  // Get total instructors
  const { count: totalInstructors } = await supabase.from("instructors").select("*", { count: "exact", head: true })

  // Get total courses
  const { count: totalCourses } = await supabase.from("courses").select("*", { count: "exact", head: true })

  // Get published courses
  const { count: publishedCourses } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)

  // Get total enrollments
  const { count: totalEnrollments } = await supabase.from("enrollments").select("*", { count: "exact", head: true })

  // Get total revenue
  const { data: payments } = await supabase.from("payments").select("amount").eq("status", "succeeded")

  const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

  // Get certificates issued
  const { count: certificatesIssued } = await supabase.from("certificates").select("*", { count: "exact", head: true })

  return {
    totalUsers: totalUsers || 0,
    totalStudents: totalStudents || 0,
    totalInstructors: totalInstructors || 0,
    totalCourses: totalCourses || 0,
    publishedCourses: publishedCourses || 0,
    totalEnrollments: totalEnrollments || 0,
    totalRevenue,
    certificatesIssued: certificatesIssued || 0,
  }
}

async function getRevenueData() {
  // Mock data for revenue chart - replace with real data from database
  return [
    { month: "Jan", revenue: 12500 },
    { month: "Feb", revenue: 15800 },
    { month: "Mar", revenue: 18200 },
    { month: "Apr", revenue: 22100 },
    { month: "May", revenue: 25600 },
    { month: "Jun", revenue: 28900 },
  ]
}

async function getTopCourses() {
  const supabase = await getSupabaseServerClient()

  const { data: courses } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      total_enrollments,
      total_revenue,
      average_rating,
      instructors (
        users (
          first_name,
          last_name
        )
      )
    `)
    .eq("is_published", true)
    .order("total_enrollments", { ascending: false })
    .limit(5)

  return (
    courses?.map((course: any) => ({
      id: course.id,
      title: course.title,
      instructor: `${course.instructors?.users?.first_name} ${course.instructors?.users?.last_name}`,
      enrollments: course.total_enrollments || 0,
      revenue: Number(course.total_revenue) || 0,
      rating: Number(course.average_rating) || 0,
    })) || []
  )
}

async function getRecentActivity() {
  // Mock data for recent activity - replace with real data from activity_log table
  return [
    {
      id: "1",
      user: {
        name: "María García",
        email: "maria@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      action: "enrolled in Advanced Endodontics",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "enrollment" as const,
    },
    {
      id: "2",
      user: {
        name: "Dr. Carlos Ruiz",
        email: "carlos@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      action: "published a new course",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "course" as const,
    },
    {
      id: "3",
      user: {
        name: "Ana Martínez",
        email: "ana@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      action: "completed payment of $49.99",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "payment" as const,
    },
    {
      id: "4",
      user: {
        name: "Luis Fernández",
        email: "luis@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      action: "earned a certificate",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      type: "certificate" as const,
    },
  ]
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  const revenueData = await getRevenueData()
  const topCourses = await getTopCourses()
  const recentActivity = await getRecentActivity()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Active Students"
          value={stats.totalStudents.toLocaleString()}
          change="+8% from last month"
          changeType="positive"
          icon={GraduationCap}
        />
        <StatsCard
          title="Total Courses"
          value={stats.totalCourses}
          description={`${stats.publishedCourses} published`}
          icon={BookOpen}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+23% from last month"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Enrollments"
          value={stats.totalEnrollments.toLocaleString()}
          change="+15% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatsCard
          title="Certificates Issued"
          value={stats.certificatesIssued.toLocaleString()}
          change="+10% from last month"
          changeType="positive"
          icon={Award}
        />
        <StatsCard
          title="Active Instructors"
          value={stats.totalInstructors}
          description="Verified and teaching"
          icon={GraduationCap}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} />
        <RecentActivity activities={recentActivity} />
      </div>

      {/* Top Courses */}
      <TopCourses courses={topCourses} />
    </div>
  )
}
