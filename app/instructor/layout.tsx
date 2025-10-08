import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verify user is an instructor
  const { data: userRecord } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userRecord?.role !== "instructor") {
    redirect("/")
  }

  return <>{children}</>
}
