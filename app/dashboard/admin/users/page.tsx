import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/components/admin/users-table"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Users, GraduationCap } from "lucide-react"

async function getUsers() {
  const supabase = await getSupabaseServerClient()

  const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return users || []
}

async function getStudents() {
  const supabase = await getSupabaseServerClient()

  const { data: students, error } = await supabase
    .from("students")
    .select(`
      *,
      users (
        id,
        email,
        first_name,
        last_name,
        is_active,
        created_at,
        last_login,
        profile_image_url
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching students:", error)
    return []
  }

  return students || []
}

export default async function UsersPage() {
  const allUsers = await getUsers()
  const students = await getStudents()

  // Transform students data for the table
  const studentUsers = students.map((student: any) => ({
    id: student.users.id,
    email: student.users.email,
    first_name: student.users.first_name,
    last_name: student.users.last_name,
    role: "student",
    is_active: student.users.is_active,
    created_at: student.users.created_at,
    last_login: student.users.last_login,
    profile_image_url: student.users.profile_image_url,
  }))

  const handleViewUser = (userId: string) => {
    console.log("[v0] View user:", userId)
  }

  const handleToggleStatus = (userId: string, isActive: boolean) => {
    console.log("[v0] Toggle user status:", userId, isActive)
  }

  const handleSendEmail = (userId: string) => {
    console.log("[v0] Send email to user:", userId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage all users, students, and their accounts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Active student accounts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage all registered users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable
                users={allUsers}
                onViewUser={handleViewUser}
                onToggleStatus={handleToggleStatus}
                onSendEmail={handleSendEmail}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>View and manage student accounts and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable
                users={studentUsers}
                onViewUser={handleViewUser}
                onToggleStatus={handleToggleStatus}
                onSendEmail={handleSendEmail}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
