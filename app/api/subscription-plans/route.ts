import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true })

    if (error) {
      return NextResponse.json({ message: "Error al obtener planes" }, { status: 500 })
    }

    return NextResponse.json({ plans: plans || [] })
  } catch (error) {
    console.error("Get subscription plans error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
