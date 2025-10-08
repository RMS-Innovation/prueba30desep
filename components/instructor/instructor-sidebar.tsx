"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Video, Users, FileQuestion, DollarSign, Settings, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface InstructorSidebarProps {
  instructor: {
    first_name: string
    last_name: string
    profile_picture_url?: string
    specialization?: string
  }
}

const navigation = [
  { name: "Dashboard", href: "/instructor", icon: LayoutDashboard },
  { name: "My Courses", href: "/instructor/courses", icon: BookOpen },
  { name: "Videos", href: "/instructor/videos", icon: Video },
  { name: "Students", href: "/instructor/students", icon: Users },
  { name: "Quizzes", href: "/instructor/quizzes", icon: FileQuestion },
  { name: "Earnings", href: "/instructor/earnings", icon: DollarSign },
]

export function InstructorSidebar({ instructor }: InstructorSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Profile Section */}
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={instructor.profile_picture_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {instructor.first_name[0]}
              {instructor.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              Dr. {instructor.first_name} {instructor.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{instructor.specialization || "Instructor"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/instructor/settings">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/instructor/notifications">
            <Bell className="h-5 w-5" />
            Notifications
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
