"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { SessionData } from "./session"

export const useAuth = () => {
  const [user, setUser] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const userData = await response.json()
      setUser(userData)
      return { success: true, user: userData }
    } else {
      const error = await response.json()
      return { success: false, error: error.message }
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: "student" | "instructor"
    phone?: string
    specialization?: string
    licenseNumber?: string
  }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (response.ok) {
      const result = await response.json()
      return { success: true, user: result }
    } else {
      const error = await response.json()
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/auth/login")
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user?.isLoggedIn,
    isAdmin: user?.role === "admin",
    isInstructor: user?.role === "instructor",
    isStudent: user?.role === "student",
  }
}
