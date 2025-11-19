// lib/session.ts
import type { SessionOptions } from "iron-session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
  user?: {
    id: string
    email: string
    name: string
    role: "student" | "instructor" | "admin"
  }
  isLoggedIn: boolean
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "!Dr5g@fdZet4@%3ed^v6!S7t4Ev*4ucw",
  cookieName: "dental-platform-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn
  }

  return session
}

declare module "iron-session" {
  interface IronSessionData extends SessionData {}
}
