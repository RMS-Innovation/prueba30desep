"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "student" | "instructor" | "admin"
  phone?: string
  profileImage?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
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
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Error al iniciar sesión" }
      }
    } catch (error) {
      return { success: false, error: "Error de conexión" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  return {
    user,
    loading,
    login,
    logout,
    refreshUser,
  }
}
