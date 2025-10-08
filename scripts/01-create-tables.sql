-- Creating comprehensive database schema for dental education platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table with role-based access (students, instructors, admin)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image_url TEXT,
  bio TEXT,
  specialization VARCHAR(100), -- For instructors
  license_number VARCHAR(50), -- For dental professionals
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories for organizing courses
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
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
  tags TEXT[], -- Array of tags
  requirements TEXT[],
  learning_objectives TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos/lessons within courses
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT FALSE, -- Free preview videos
  transcript TEXT,
  resources TEXT[], -- Additional resources/links
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, course_id)
);

-- Track video progress for each student
CREATE TABLE video_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  watched_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, video_id)
);

-- Subscription plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('monthly', 'yearly')),
  features TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  stripe_price_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual course payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  payment_method VARCHAR(50), -- stripe, paypal, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT,
  verification_token VARCHAR(255) UNIQUE,
  is_valid BOOLEAN DEFAULT TRUE,
  metadata JSONB, -- Additional certificate data
  UNIQUE(student_id, course_id)
);

-- Notifications system
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- email, whatsapp, in_app
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier VARCHAR(255) NOT NULL, -- IP address or user ID
  action VARCHAR(100) NOT NULL, -- login, api_call, etc.
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, action, window_start)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_videos_course ON videos(course_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_video_progress_student ON video_progress(student_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier, action);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_progress_updated_at BEFORE UPDATE ON video_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
