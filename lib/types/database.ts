export interface User {
  id: string
  email: string
  password_hash: string
  role: "student" | "instructor" | "admin"
  created_at: string
  updated_at: string
}

export interface Instructor {
  id: string
  user_id: string
  first_name: string
  last_name: string
  bio?: string
  profile_picture_url?: string
  specialization?: string
  years_of_experience?: number
  credentials?: string
  rating: number
  total_students: number
  total_courses: number
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  instructor_id: string
  title: string
  description?: string
  thumbnail_url?: string
  category?: string
  level?: "beginner" | "intermediate" | "advanced"
  price: number
  is_published: boolean
  total_duration: number
  total_enrollments: number
  rating: number
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  module_id: string
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration: number
  order_index: number
  is_preview: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  first_name: string
  last_name: string
  profile_picture_url?: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  enrolled_at: string
  progress: number
  completed_at?: string
}

export interface Payment {
  id: string
  student_id: string
  course_id?: string
  amount: number
  currency: string
  payment_method?: string
  stripe_payment_id?: string
  status: "pending" | "completed" | "failed" | "refunded"
  created_at: string
}

export interface InstructorEarning {
  id: string
  instructor_id: string
  payment_id: string
  amount: number
  platform_fee: number
  net_amount: number
  status: "pending" | "paid" | "processing"
  paid_at?: string
  created_at: string
}

export interface Quiz {
  id: string
  module_id: string
  title: string
  description?: string
  passing_score: number
  time_limit?: number
  order_index: number
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: "multiple_choice" | "true_false" | "short_answer"
  points: number
  order_index: number
  created_at: string
}

export interface QuizOption {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  order_index: number
}

export interface Review {
  id: string
  course_id: string
  student_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  enrollment_id: string
  certificate_url?: string
  issued_at: string
  verification_code: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type?: string
  is_read: boolean
  created_at: string
}
