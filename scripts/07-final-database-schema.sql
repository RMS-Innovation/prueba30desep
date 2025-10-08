-- =========================================
-- USERS (core authentication)
-- =========================================
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

-- =========================================
-- LOOKUP TABLES
-- =========================================
CREATE TABLE IF NOT EXISTS course_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS course_levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('beginner', 'intermediate', 'advanced'))
);

-- =========================================
-- STUDENTS
-- =========================================
CREATE SEQUENCE IF NOT EXISTS student_seq START 1;

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_number VARCHAR(20) UNIQUE,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para student_number
CREATE OR REPLACE FUNCTION generate_student_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.student_number IS NULL THEN
    NEW.student_number := 'STU' || LPAD(nextval('student_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_student_number
BEFORE INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION generate_student_number();

-- =========================================
-- INSTRUCTORS
-- =========================================
CREATE SEQUENCE IF NOT EXISTS instructor_seq START 1;

CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  instructor_number VARCHAR(20) UNIQUE,
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

-- Trigger para instructor_number
CREATE OR REPLACE FUNCTION generate_instructor_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.instructor_number IS NULL THEN
    NEW.instructor_number := 'INS' || LPAD(nextval('instructor_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_instructor_number
BEFORE INSERT ON instructors
FOR EACH ROW
EXECUTE FUNCTION generate_instructor_number();

-- =========================================
-- ADMINS
-- =========================================
CREATE SEQUENCE IF NOT EXISTS admin_seq START 1;

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  admin_number VARCHAR(20) UNIQUE,
  department VARCHAR(100),
  permissions JSONB DEFAULT '[]',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para admin_number
CREATE OR REPLACE FUNCTION generate_admin_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.admin_number IS NULL THEN
    NEW.admin_number := 'ADM' || LPAD(nextval('admin_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_admin_number
BEFORE INSERT ON admins
FOR EACH ROW
EXECUTE FUNCTION generate_admin_number();

-- =========================================
-- COURSES
-- =========================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  thumbnail TEXT,
  instructor_id UUID REFERENCES instructors(id),
  category_id INT REFERENCES course_categories(id),
  level_id INT REFERENCES course_levels(id),
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

-- =========================================
-- LESSONS (contenido del curso)
-- =========================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url TEXT,
  order_number INT,
  duration INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- ASSIGNMENTS (tareas/exámenes)
-- =========================================
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  max_score INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- SUBMISSIONS (entregas de estudiantes)
-- =========================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  grade DECIMAL(5,2),
  feedback TEXT
);

-- =========================================
-- DISCUSSIONS (foros/comentarios)
-- =========================================
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- ENROLLMENTS (Matrículas)
-- =========================================
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

-- =========================================
-- COURSE ACTIVITY (tracking de progreso)
-- =========================================
CREATE TABLE IF NOT EXISTS course_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  progress DECIMAL(5,2)
);

-- =========================================
-- PAYMENTS
-- =========================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  course_id UUID REFERENCES courses(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50),
  transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- NOTIFICATION SETTINGS
-- =========================================
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_instructors_user_id ON instructors(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_discussions_course_id ON discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_activity_enrollment_id ON course_activity(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_activity_lesson_id ON course_activity(lesson_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_course_id ON payments(course_id);

-- =========================================
-- TRIGGER FOR UPDATED_AT
-- =========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables that have updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- INSERT SAMPLE DATA
-- =========================================

-- Insert course categories
INSERT INTO course_categories (name) VALUES 
('Anatomía Dental'),
('Endodoncia'),
('Periodoncia'),
('Ortodoncia'),
('Cirugía Oral'),
('Prótesis Dental')
ON CONFLICT (name) DO NOTHING;

-- Insert course levels
INSERT INTO course_levels (name) VALUES 
('beginner'),
('intermediate'),
('advanced')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active, is_verified) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'admin@dentaledu.com', 'admin123', 'admin', 'Carlos', 'Administrador', true, true),
('550e8400-e29b-41d4-a716-446655440002', 'instructor@dentaledu.com', 'instructor123', 'instructor', 'Dr. María', 'González', true, true),
('550e8400-e29b-41d4-a716-446655440003', 'juanemiliocastromedina@gmail.com', 'emiliox', 'student', 'Juan Emilio', 'Castro Medina', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert admin profile
INSERT INTO admins (user_id, department, permissions) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Administración General', '["manage_users", "manage_courses", "view_analytics", "manage_payments"]')
ON CONFLICT (user_id) DO NOTHING;

-- Insert instructor profile
INSERT INTO instructors (user_id, specialization, license_number, years_experience, education, bio, hourly_rate) VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'Endodoncia', 'LIC-12345', 10, 'Doctorado en Odontología - Universidad Nacional', 'Especialista en endodoncia con más de 10 años de experiencia', 75.00)
ON CONFLICT (user_id) DO NOTHING;

-- Insert student profile
INSERT INTO students (user_id, phone, education_level, goals, learning_style) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '+57 300 123 4567', 'Estudiante de Odontología', 'Convertirme en un dentista especializado en endodoncia', 'visual')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (id, title, slug, description, instructor_id, category_id, level_id, duration, price, status, total_lessons) VALUES 
('650e8400-e29b-41d4-a716-446655440001', 'Anatomía Dental Avanzada', 'anatomia-dental-avanzada', 'Curso completo de anatomía dental para estudiantes avanzados', (SELECT id FROM instructors WHERE user_id = '550e8400-e29b-41d4-a716-446655440002'), 1, 3, 1200, 299.99, 'published', 12),
('650e8400-e29b-41d4-a716-446655440002', 'Técnicas de Endodoncia', 'tecnicas-endodoncia', 'Aprende las técnicas más modernas de endodoncia', (SELECT id FROM instructors WHERE user_id = '550e8400-e29b-41d4-a716-446655440002'), 2, 2, 900, 199.99, 'published', 15)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample enrollments
INSERT INTO enrollments (student_id, course_id, status, progress_percentage) VALUES 
((SELECT id FROM students WHERE user_id = '550e8400-e29b-41d4-a716-446655440003'), '650e8400-e29b-41d4-a716-446655440001', 'active', 75.00),
((SELECT id FROM students WHERE user_id = '550e8400-e29b-41d4-a716-446655440003'), '650e8400-e29b-41d4-a716-446655440002', 'active', 46.67)
ON CONFLICT (student_id, course_id) DO NOTHING;
