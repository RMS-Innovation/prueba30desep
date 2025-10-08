import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { InstructorSettingsForm } from "@/components/instructor/instructor-settings-form"

export default async function InstructorSettingsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: instructor } = await supabase.from("instructors").select("*").eq("user_id", user.id).single()

  if (!instructor) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <InstructorSidebar instructor={instructor} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and bio</CardDescription>
              </CardHeader>
              <CardContent>
                <InstructorSettingsForm instructor={instructor} userEmail={user.email || ""} />
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Manage your payout methods and tax information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Payment settings will be configured through your payment provider. Contact support for assistance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">New Enrollments</p>
                      <p className="text-sm text-muted-foreground">Get notified when students enroll in your courses</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Course Reviews</p>
                      <p className="text-sm text-muted-foreground">Receive alerts for new course reviews</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Payment Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified about earnings and payouts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
