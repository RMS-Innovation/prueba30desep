export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: "student" | "instructor" | "admin"
          first_name: string | null
          last_name: string | null
          profile_image_url: string | null
          is_active: boolean
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role: "student" | "instructor" | "admin"
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          is_active?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: "student" | "instructor" | "admin"
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          is_active?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      course_categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      course_levels: {
        Row: {
          id: number
          name: "beginner" | "intermediate" | "advanced"
        }
        Insert: {
          id?: number
          name: "beginner" | "intermediate" | "advanced"
        }
        Update: {
          id?: number
          name?: "beginner" | "intermediate" | "advanced"
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          student_number: string | null
          date_of_birth: string | null
          phone: string | null
          address: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          learning_style: "visual" | "auditory" | "kinesthetic" | "reading" | null
          education_level: string | null
          goals: string | null
          bio: string | null
          timezone: string
          language_preference: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          student_number?: string | null
          date_of_birth?: string | null
          phone?: string | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          learning_style?: "visual" | "auditory" | "kinesthetic" | "reading" | null
          education_level?: string | null
          goals?: string | null
          bio?: string | null
          timezone?: string
          language_preference?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          student_number?: string | null
          date_of_birth?: string | null
          phone?: string | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          learning_style?: "visual" | "auditory" | "kinesthetic" | "reading" | null
          education_level?: string | null
          goals?: string | null
          bio?: string | null
          timezone?: string
          language_preference?: string
          created_at?: string
          updated_at?: string
        }
      }
      instructors: {
        Row: {
          id: string
          user_id: string
          instructor_number: string | null
          specialization: string | null
          license_number: string | null
          years_experience: number | null
          education: string | null
          certifications: string[] | null
          bio: string | null
          hourly_rate: number | null
          availability: any | null
          rating: number
          total_students: number
          total_courses: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          instructor_number?: string | null
          specialization?: string | null
          license_number?: string | null
          years_experience?: number | null
          education?: string | null
          certifications?: string[] | null
          bio?: string | null
          hourly_rate?: number | null
          availability?: any | null
          rating?: number
          total_students?: number
          total_courses?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          instructor_number?: string | null
          specialization?: string | null
          license_number?: string | null
          years_experience?: number | null
          education?: string | null
          certifications?: string[] | null
          bio?: string | null
          hourly_rate?: number | null
          availability?: any | null
          rating?: number
          total_students?: number
          total_courses?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          user_id: string
          admin_number: string | null
          department: string | null
          permissions: any | null
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          admin_number?: string | null
          department?: string | null
          permissions?: any | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          admin_number?: string | null
          department?: string | null
          permissions?: any | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          thumbnail: string | null
          instructor_id: string | null
          category_id: number | null
          level_id: number | null
          duration: number | null
          price: number
          currency: string
          language: string
          status: "draft" | "published" | "archived"
          total_lessons: number
          total_students: number
          rating: number
          total_reviews: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          thumbnail?: string | null
          instructor_id?: string | null
          category_id?: number | null
          level_id?: number | null
          duration?: number | null
          price?: number
          currency?: string
          language?: string
          status?: "draft" | "published" | "archived"
          total_lessons?: number
          total_students?: number
          rating?: number
          total_reviews?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          thumbnail?: string | null
          instructor_id?: string | null
          category_id?: number | null
          level_id?: number | null
          duration?: number | null
          price?: number
          currency?: string
          language?: string
          status?: "draft" | "published" | "archived"
          total_lessons?: number
          total_students?: number
          rating?: number
          total_reviews?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string | null
          video_url: string | null
          order_number: number | null
          duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content?: string | null
          video_url?: string | null
          order_number?: number | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string | null
          video_url?: string | null
          order_number?: number | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          due_date: string | null
          max_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          due_date?: string | null
          max_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          max_score?: number | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          submitted_at: string
          grade: number | null
          feedback: string | null
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          submitted_at?: string
          grade?: number | null
          feedback?: string | null
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          submitted_at?: string
          grade?: number | null
          feedback?: string | null
        }
      }
      discussions: {
        Row: {
          id: string
          course_id: string | null
          user_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id?: string | null
          user_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string | null
          user_id?: string | null
          content?: string
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          status: "active" | "completed" | "dropped" | "suspended"
          progress_percentage: number
          last_accessed: string | null
          certificate_issued: boolean
          certificate_url: string | null
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          status?: "active" | "completed" | "dropped" | "suspended"
          progress_percentage?: number
          last_accessed?: string | null
          certificate_issued?: boolean
          certificate_url?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          status?: "active" | "completed" | "dropped" | "suspended"
          progress_percentage?: number
          last_accessed?: string | null
          certificate_issued?: boolean
          certificate_url?: string | null
        }
      }
      course_activity: {
        Row: {
          id: string
          enrollment_id: string
          lesson_id: string | null
          accessed_at: string
          progress: number | null
        }
        Insert: {
          id?: string
          enrollment_id: string
          lesson_id?: string | null
          accessed_at?: string
          progress?: number | null
        }
        Update: {
          id?: string
          enrollment_id?: string
          lesson_id?: string | null
          accessed_at?: string
          progress?: number | null
        }
      }
      payments: {
        Row: {
          id: string
          student_id: string | null
          course_id: string | null
          amount: number
          currency: string
          payment_method: string | null
          payment_provider: string | null
          transaction_id: string | null
          status: "pending" | "completed" | "failed" | "refunded"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          amount: number
          currency?: string
          payment_method?: string | null
          payment_provider?: string | null
          transaction_id?: string | null
          status?: "pending" | "completed" | "failed" | "refunded"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          amount?: number
          currency?: string
          payment_method?: string | null
          payment_provider?: string | null
          transaction_id?: string | null
          status?: "pending" | "completed" | "failed" | "refunded"
          created_at?: string
          updated_at?: string
        }
      }
      notification_settings: {
        Row: {
          id: string
          user_id: string
          email_enabled: boolean
          push_enabled: boolean
          sms_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_enabled?: boolean
          push_enabled?: boolean
          sms_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_enabled?: boolean
          push_enabled?: boolean
          sms_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type UserRole = "student" | "instructor" | "admin"
export type CourseStatus = "draft" | "published" | "archived"
export type EnrollmentStatus = "active" | "completed" | "dropped" | "suspended"
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"
export type LearningStyle = "visual" | "auditory" | "kinesthetic" | "reading"
export type CourseLevel = "beginner" | "intermediate" | "advanced"
