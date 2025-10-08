import { createClient } from "@supabase/supabase-js"
import { dbConfig } from "../config"

export class SQLAdapter {
  private client

  constructor() {
    this.client = createClient(dbConfig.sql.url, dbConfig.sql.serviceKey)
  }

  // User operations
  async createUser(userData: any) {
    const { data, error } = await this.client.from("users").insert(userData).select().single()

    if (error) throw error
    return data
  }

  async getUserByEmail(email: string) {
    const { data, error } = await this.client.from("users").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  }

  async getUserById(id: string) {
    const { data, error } = await this.client.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }

  // Student operations
  async createStudentProfile(userId: string, profileData: any) {
    const { data, error } = await this.client
      .from("students")
      .insert({ user_id: userId, ...profileData })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getStudentProfile(userId: string) {
    const { data, error } = await this.client
      .from("students")
      .select(`
        *,
        users (
          id, email, first_name, last_name, 
          profile_image_url, is_active, created_at
        )
      `)
      .eq("user_id", userId)
      .single()

    if (error) throw error
    return data
  }

  // Course operations
  async getCourses(filters?: any) {
    let query = this.client.from("courses").select("*")

    if (filters?.category) {
      query = query.eq("category", filters.category)
    }

    if (filters?.level) {
      query = query.eq("level", filters.level)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Enrollment operations
  async enrollStudent(studentId: string, courseId: string) {
    const { data, error } = await this.client
      .from("enrollments")
      .insert({
        student_id: studentId,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        status: "active",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getStudentEnrollments(studentId: string) {
    const { data, error } = await this.client
      .from("enrollments")
      .select(`
        *,
        courses (
          id, title, description, thumbnail, 
          duration, level, category
        )
      `)
      .eq("student_id", studentId)

    if (error) throw error
    return data
  }
}
