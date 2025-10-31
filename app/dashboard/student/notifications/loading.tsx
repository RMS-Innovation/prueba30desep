import { Sidebar } from "@/components/layout/sidebar"

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />
      <div className="md:ml-64">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
