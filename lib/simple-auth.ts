import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: "student" | "instructor" | "admin"
  profileImage?: string | null
  isVerified?: boolean
  isLoggedIn?: boolean
}

export async function getSimpleSession(): Promise<{ user: User | null; isLoggedIn: boolean }> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("simple-session")

    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value)
        if (sessionData.user) {
          return {
            user: {
              id: sessionData.user.id,
              email: sessionData.user.email,
              name: `${sessionData.user.firstName} ${sessionData.user.lastName}`,
              firstName: sessionData.user.firstName,
              lastName: sessionData.user.lastName,
              role: sessionData.user.role,
              profileImage: sessionData.user.profilePicture,
              isVerified: sessionData.user.isVerified,
              isLoggedIn: true,
            },
            isLoggedIn: true,
          }
        }
      } catch (parseError) {
        console.log("Error parsing session cookie:", parseError)
      }
    }

    return { user: null, isLoggedIn: false }
  } catch (error) {
    console.error("Error getting session:", error)
    return { user: null, isLoggedIn: false }
  }
}

export async function createSimpleSession(user: User) {
  try {
    const cookieStore = await cookies()
    // In production, this would create a secure session token
    cookieStore.set("simple-session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch (error) {
    console.error("Error creating session:", error)
  }
}

export async function destroySimpleSession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("simple-session")
  } catch (error) {
    console.error("Error destroying session:", error)
  }
}

export function setSimpleSession(response: Response, user: User) {
  try {
    const sessionData = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      isLoggedIn: true,
    })

    response.headers.set(
      "Set-Cookie",
      `simple-session=${sessionData}; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Path=/`,
    )
  } catch (error) {
    console.error("Error setting session cookie:", error)
  }
}
