import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getAdminUser() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get user details with role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*, admins(*)")
    .eq("auth0_id", user.id)
    .single()

  if (userError || !userData || userData.role !== "admin") {
    return null
  }

  return {
    ...user,
    userData,
    adminData: userData.admins,
  }
}

export async function requireAdmin() {
  const admin = await getAdminUser()

  if (!admin) {
    throw new Error("Unauthorized: Admin access required")
  }

  return admin
}
