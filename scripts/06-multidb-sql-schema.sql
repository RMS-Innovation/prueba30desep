-- Enhanced SQL schema for relational data
-- This handles structured, transactional data

-- Users table (core authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table (student-specific data)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'STU' || LPAD(nextval('student_seq')::TEXT, 6, '0'),
  date_of_birth DATE,
  phone VARCHAR(20),
  address TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  learning_style VARCHAR(50) CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading')),
  education_level VARCHAR(50),
  goals TEXT,
  bio TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language_preference VARCHAR(10) DEFAULT 'es',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructors table (instructor-specific data)
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  instructor_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'INS' || LPAD(nextval('instructor_seq')::TEXT, 6, '0'),
  specialization VARCHAR(100),
  license_number VARCHAR(50),
  years_experience INTEGER,
  education TEXT,
  certifications TEXT[],
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  availability JSONB,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_students INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins table (admin-specific data)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  admin_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'ADM' || LPAD(nextval('admin_seq')::TEXT, 6, '0'),
  department VARCHAR(100),
  permissions JSONB DEFAULT '[]',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table (structured course data)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  thumbnail TEXT,
  instructor_id UUID REFERENCES instructors(id),
  category VARCHAR(100),
  level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER, -- in minutes
  price DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  language VARCHAR(10) DEFAULT 'es',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  total_lessons INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table (student-course relationships)
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'suspended')),
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  last_accessed TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  UNIQUE(student_id, course_id)
);

-- Payments table (transaction records)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  course_id UUID REFERENCES courses(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50),
  transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sequences for auto-generated numbers
CREATE SEQUENCE IF NOT EXISTS student_seq START 1;
CREATE SEQUENCE IF NOT EXISTS instructor_seq START 1;
CREATE SEQUENCE IF NOT EXISTS admin_seq START 1;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_instructors_user_id ON instructors(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
