import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Create and manage platform-wide announcements</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Manage announcements sent to users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No announcements yet. Create your first announcement to get started.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
