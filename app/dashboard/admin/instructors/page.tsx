import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InstructorsTable } from "@/components/admin/instructors-table"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { GraduationCap, Clock, CheckCircle, XCircle } from "lucide-react"

async function getInstructors() {
  const supabase = await getSupabaseServerClient()

  const { data: instructors, error } = await supabase
    .from("instructors")
    .select(`
      *,
      users (
        email,
        first_name,
        last_name,
        profile_image_url
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching instructors:", error)
    return []
  }

  return instructors || []
}

export default async function InstructorsPage() {
  const instructors = await getInstructors()

  const pendingCount = instructors.filter((i: any) => i.status === "pending").length
  const approvedCount = instructors.filter((i: any) => i.status === "approved").length
  const rejectedCount = instructors.filter((i: any) => i.status === "rejected").length

  const handleViewInstructor = (instructorId: string) => {
    console.log("[v0] View instructor:", instructorId)
  }

  const handleApprove = (instructorId: string) => {
    console.log("[v0] Approve instructor:", instructorId)
  }

  const handleReject = (instructorId: string) => {
    console.log("[v0] Reject instructor:", instructorId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Instructor Management</h1>
        <p className="text-muted-foreground">Review and manage instructor applications and accounts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructors.length}</div>
            <p className="text-xs text-muted-foreground">All instructors</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Active instructors</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Instructors</CardTitle>
          <CardDescription>Review applications, approve or reject instructor accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <InstructorsTable
            instructors={instructors}
            onViewInstructor={handleViewInstructor}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </CardContent>
      </Card>
    </div>
  )
}
