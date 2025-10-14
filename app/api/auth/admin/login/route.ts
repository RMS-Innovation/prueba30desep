import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const supabase = await getSupabaseServerClient()

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Verify admin role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, admins(*)")
      .eq("auth0_id", data.user.id)
      .single()

    if (userError || !userData || userData.role !== "admin") {
      await supabase.auth.signOut()
      return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      admin: userData.admins,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get admin data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*, admins(*)")
      .eq("auth0_id", user.id)
      .single()

    if (userError || !userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    return NextResponse.json({
      user,
      userData,
      adminData: userData.admins,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
