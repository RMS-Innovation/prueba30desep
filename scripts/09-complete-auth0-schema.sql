-- =====================================================
-- COMPLETE DATABASE SCHEMA WITH AUTH0 INTEGRATION
-- Full schema for production deployment
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS TABLE (AUTH0 INTEGRATED)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  auth_provider VARCHAR(50) DEFAULT 'auth0',
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image_url TEXT,
  bio TEXT,
  specialization VARCHAR(100),
  license_number VARCHAR(50),
  is_verified BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  notification_preferences JSONB DEFAULT '{"email": true, "whatsapp": false, "push": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ALL OTHER TABLES (UNCHANGED FROM PREVIOUS SCHEMA)
-- =====================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  trailer_video_url TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_hours INTEGER DEFAULT 0,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  requirements TEXT[],
  learning_objectives TEXT[],
  certificate_template TEXT,
  completion_criteria JSONB DEFAULT '{"min_progress": 80, "required_videos": "all"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT FALSE,
  transcript TEXT,
  resources TEXT[],
  processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  video_quality JSONB DEFAULT '{"720p": null, "1080p": null}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  access_expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS video_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  watched_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_position INTEGER DEFAULT 0,
  watch_sessions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, video_id)
);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('monthly', 'yearly')),
  features TEXT[],
  max_courses INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  stripe_price_id VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'refunded')),
  payment_method VARCHAR(50),
  refund_amount DECIMAL(10,2) DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT,
  verification_token VARCHAR(255) UNIQUE,
  is_valid BOOLEAN DEFAULT TRUE,
  blockchain_hash VARCHAR(255),
  metadata JSONB,
  template_used VARCHAR(100),
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered', 'read')),
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

-- =====================================================
-- INDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_videos_course ON videos(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_student ON video_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- =====================================================
-- SEED DATA
-- =====================================================

INSERT INTO categories (name, description, slug, sort_order) VALUES
('Odontología General', 'Cursos fundamentales de odontología general', 'odontologia-general', 1),
('Endodoncia', 'Especialización en tratamientos de conducto', 'endodoncia', 2),
('Ortodoncia', 'Corrección de malposiciones dentales', 'ortodoncia', 3),
('Periodoncia', 'Tratamiento de enfermedades periodontales', 'periodoncia', 4),
('Cirugía Oral', 'Procedimientos quirúrgicos orales', 'cirugia-oral', 5),
('Prótesis Dental', 'Rehabilitación protésica', 'protesis-dental', 6),
('Odontopediatría', 'Odontología para niños', 'odontopediatria', 7),
('Estética Dental', 'Tratamientos estéticos y cosméticos', 'estetica-dental', 8)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subscription_plans (name, description, price, billing_interval, features, sort_order) VALUES
('Plan Básico', 'Acceso a cursos básicos', 29.99, 'monthly', 
 ARRAY['Acceso a 10 cursos', 'Certificados digitales', 'Soporte por email'], 1),
('Plan Profesional', 'Acceso completo a la plataforma', 49.99, 'monthly',
 ARRAY['Acceso ilimitado a cursos', 'Certificados digitales', 'Soporte prioritario', 'Talleres en vivo'], 2),
('Plan Anual Básico', 'Plan básico con descuento anual', 299.99, 'yearly',
 ARRAY['Acceso a 10 cursos', 'Certificados digitales', 'Soporte por email', '2 meses gratis'], 3),
('Plan Anual Profesional', 'Plan profesional con descuento anual', 499.99, 'yearly',
 ARRAY['Acceso ilimitado a cursos', 'Certificados digitales', 'Soporte prioritario', 'Talleres en vivo', '2 meses gratis'], 4)
ON CONFLICT DO NOTHING;

COMMENT ON DATABASE postgres IS 'Plataforma Educativa Dental - Auth0 Integrated';
