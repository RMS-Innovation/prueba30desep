// lib/auth.ts
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export const createServerClient = async (request?: NextRequest) => {
  const cookieStore = await cookies()

  const supabase = createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.delete(name)
        },
      },
    },
  )

  return supabase
}

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const checkRateLimit = async (
  identifier: string,
  action: string,
  limit = 100, // Increased default limit
  windowMinutes = 60, // Increased window to 1 hour
): Promise<{ allowed: boolean; remaining: number }> => {
  try {
    // Use service role key for rate limiting operations
    const supabase = createSupabaseServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        cookies: {
          get() {
            return undefined
          },
          set() {},
          remove() {},
        },
      },
    )

    const windowStart = new Date()
    windowStart.setMinutes(windowStart.getMinutes() - windowMinutes)

    // Clean old entries
    await supabase.from("rate_limits").delete().lt("window_start", windowStart.toISOString())

    // Get current count
    const { data: existing } = await supabase
      .from("rate_limits")
      .select("count")
      .eq("identifier", identifier)
      .eq("action", action)
      .gte("window_start", windowStart.toISOString())
      .single()

    const currentCount = existing?.count || 0

    if (currentCount >= limit) {
      return { allowed: false, remaining: 0 }
    }

    // Increment or create rate limit entry
    if (existing) {
      await supabase
        .from("rate_limits")
        .update({ count: currentCount + 1 })
        .eq("identifier", identifier)
        .eq("action", action)
        .gte("window_start", windowStart.toISOString())
    } else {
      await supabase.from("rate_limits").insert({
        identifier,
        action,
        count: 1,
        window_start: new Date().toISOString(),
      })
    }

    return { allowed: true, remaining: limit - currentCount - 1 }
  } catch (error) {
    console.error("Rate limit check error:", error)
    // If rate limiting fails, allow the request to proceed
    return { allowed: true, remaining: limit - 1 }
  }
}
