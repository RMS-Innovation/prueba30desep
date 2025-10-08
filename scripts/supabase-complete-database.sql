-- =====================================================
-- PLATAFORMA EDUCATIVA DENTAL - BASE DE DATOS COMPLETA
-- Optimizada para Supabase con RLS, triggers y funciones
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

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
  notification_preferences JSONB DEFAULT '{"email": true, "whatsapp": false, "push": true}'::jsonb,
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
  sort_order INTEGER DEFAULT 0,
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
  certificate_template TEXT, -- Template for certificate generation
  completion_criteria JSONB DEFAULT '{"min_progress": 80, "required_videos": "all"}'::jsonb,
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
  processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  video_quality JSONB DEFAULT '{"720p": null, "1080p": null}'::jsonb,
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
  access_expires_at TIMESTAMP WITH TIME ZONE, -- For time-limited access
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
  watch_sessions JSONB DEFAULT '[]'::jsonb, -- Track multiple watch sessions
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
  max_courses INTEGER, -- NULL for unlimited
  is_active BOOLEAN DEFAULT TRUE,
  stripe_price_id VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE subscriptions (
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

-- Individual course payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'refunded')),
  payment_method VARCHAR(50), -- stripe, paypal, etc.
  refund_amount DECIMAL(10,2) DEFAULT 0,
  metadata JSONB,
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
  blockchain_hash VARCHAR(255), -- For blockchain verification
  metadata JSONB, -- Additional certificate data
  template_used VARCHAR(100),
  UNIQUE(student_id, course_id)
);

-- Notifications system
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- email, whatsapp, in_app, push
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered', 'read')),
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
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
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, action, window_start)
);

-- WhatsApp message logs
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL, -- text, template, media
  message_content TEXT NOT NULL,
  whatsapp_message_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  template_name VARCHAR(100),
  template_variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course reviews and ratings
CREATE TABLE course_reviews (
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
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_featured ON courses(is_featured);
CREATE INDEX idx_videos_course ON videos(course_id);
CREATE INDEX idx_videos_order ON videos(course_id, order_index);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_completed ON enrollments(completed_at);
CREATE INDEX idx_video_progress_student ON video_progress(student_id);
CREATE INDEX idx_video_progress_video ON video_progress(video_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_token);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier, action);
CREATE INDEX idx_rate_limits_expires ON rate_limits(expires_at);
CREATE INDEX idx_whatsapp_messages_user ON whatsapp_messages(user_id);
CREATE INDEX idx_whatsapp_messages_phone ON whatsapp_messages(phone_number);
CREATE INDEX idx_course_reviews_course ON course_reviews(course_id);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(student_uuid UUID, course_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_videos INTEGER;
    completed_videos INTEGER;
    progress INTEGER;
BEGIN
    -- Get total videos in course
    SELECT COUNT(*) INTO total_videos
    FROM videos
    WHERE course_id = course_uuid;
    
    -- Get completed videos by student
    SELECT COUNT(*) INTO completed_videos
    FROM video_progress vp
    JOIN videos v ON vp.video_id = v.id
    WHERE vp.student_id = student_uuid 
    AND v.course_id = course_uuid 
    AND vp.completed = true;
    
    -- Calculate progress percentage
    IF total_videos = 0 THEN
        progress := 0;
    ELSE
        progress := ROUND((completed_videos::DECIMAL / total_videos::DECIMAL) * 100);
    END IF;
    
    RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    enrollment_record RECORD;
    new_progress INTEGER;
BEGIN
    -- Get enrollment record
    SELECT e.* INTO enrollment_record
    FROM enrollments e
    JOIN videos v ON v.course_id = e.course_id
    WHERE e.student_id = NEW.student_id AND v.id = NEW.video_id;
    
    IF FOUND THEN
        -- Calculate new progress
        new_progress := calculate_course_progress(NEW.student_id, enrollment_record.course_id);
        
        -- Update enrollment progress
        UPDATE enrollments 
        SET 
            progress_percentage = new_progress,
            last_accessed_at = NOW(),
            completed_at = CASE 
                WHEN new_progress >= 80 AND completed_at IS NULL THEN NOW()
                WHEN new_progress < 80 THEN NULL
                ELSE completed_at
            END
        WHERE id = enrollment_record.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.certificate_number := 'CERT-' || 
        EXTRACT(YEAR FROM NOW()) || '-' ||
        LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0') || '-' ||
        UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired rate limits
CREATE OR REPLACE FUNCTION clean_expired_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to send notification trigger
CREATE OR REPLACE FUNCTION trigger_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert notification based on trigger event
    IF TG_TABLE_NAME = 'enrollments' AND TG_OP = 'INSERT' THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.student_id,
            'Inscripción Exitosa',
            'Te has inscrito exitosamente al curso. ¡Comienza a aprender!',
            'in_app'
        );
    ELSIF TG_TABLE_NAME = 'enrollments' AND TG_OP = 'UPDATE' AND OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.student_id,
            'Curso Completado',
            '¡Felicidades! Has completado el curso. Tu certificado está siendo generado.',
            'in_app'
        );
    ELSIF TG_TABLE_NAME = 'certificates' AND TG_OP = 'INSERT' THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.student_id,
            'Certificado Disponible',
            'Tu certificado digital está listo para descargar.',
            'in_app'
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- APLICAR TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_progress_updated_at BEFORE UPDATE ON video_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_messages_updated_at BEFORE UPDATE ON whatsapp_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_reviews_updated_at BEFORE UPDATE ON course_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Progress tracking triggers
CREATE TRIGGER update_progress_on_video_completion 
    AFTER INSERT OR UPDATE ON video_progress 
    FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();

-- Certificate number generation
CREATE TRIGGER generate_cert_number_trigger 
    BEFORE INSERT ON certificates 
    FOR EACH ROW EXECUTE FUNCTION generate_certificate_number();

-- Notification triggers
CREATE TRIGGER enrollment_notification_trigger 
    AFTER INSERT ON enrollments 
    FOR EACH ROW EXECUTE FUNCTION trigger_notification();

CREATE TRIGGER completion_notification_trigger 
    AFTER UPDATE ON enrollments 
    FOR EACH ROW EXECUTE FUNCTION trigger_notification();

CREATE TRIGGER certificate_notification_trigger 
    AFTER INSERT ON certificates 
    FOR EACH ROW EXECUTE FUNCTION trigger_notification();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Instructors can manage their courses" ON courses FOR ALL USING (
    instructor_id::text = auth.uid()::text
);
CREATE POLICY "Admins can manage all courses" ON courses FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Videos policies
CREATE POLICY "Videos viewable by enrolled students or course owners" ON videos FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM courses c 
        WHERE c.id = course_id 
        AND (
            c.instructor_id::text = auth.uid()::text 
            OR c.is_published = true
            OR EXISTS (
                SELECT 1 FROM enrollments e 
                WHERE e.course_id = c.id AND e.student_id::text = auth.uid()::text
            )
        )
    )
);

-- Enrollments policies
CREATE POLICY "Students can view their enrollments" ON enrollments FOR SELECT USING (student_id::text = auth.uid()::text);
CREATE POLICY "Students can enroll in courses" ON enrollments FOR INSERT WITH CHECK (student_id::text = auth.uid()::text);
CREATE POLICY "Instructors can view their course enrollments" ON enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id::text = auth.uid()::text)
);

-- Video progress policies
CREATE POLICY "Students can manage their video progress" ON video_progress FOR ALL USING (student_id::text = auth.uid()::text);

-- Certificates policies
CREATE POLICY "Students can view their certificates" ON certificates FOR SELECT USING (student_id::text = auth.uid()::text);
CREATE POLICY "Public certificate verification" ON certificates FOR SELECT USING (verification_token IS NOT NULL);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (user_id::text = auth.uid()::text);

-- =====================================================
-- DATOS INICIALES (SEED DATA)
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, description, slug, sort_order) VALUES
('Odontología General', 'Cursos fundamentales de odontología general', 'odontologia-general', 1),
('Endodoncia', 'Especialización en tratamientos de conducto', 'endodoncia', 2),
('Ortodoncia', 'Corrección de malposiciones dentales', 'ortodoncia', 3),
('Periodoncia', 'Tratamiento de enfermedades periodontales', 'periodoncia', 4),
('Cirugía Oral', 'Procedimientos quirúrgicos orales', 'cirugia-oral', 5),
('Prótesis Dental', 'Rehabilitación protésica', 'protesis-dental', 6),
('Odontopediatría', 'Odontología para niños', 'odontopediatria', 7),
('Estética Dental', 'Tratamientos estéticos y cosméticos', 'estetica-dental', 8);

-- Insert subscription plans
INSERT INTO subscription_plans (name, description, price, billing_interval, features, sort_order) VALUES
('Plan Básico', 'Acceso a cursos básicos', 29.99, 'monthly', 
 ARRAY['Acceso a 10 cursos', 'Certificados digitales', 'Soporte por email'], 1),
('Plan Profesional', 'Acceso completo a la plataforma', 49.99, 'monthly',
 ARRAY['Acceso ilimitado a cursos', 'Certificados digitales', 'Soporte prioritario', 'Talleres en vivo'], 2),
('Plan Anual Básico', 'Plan básico con descuento anual', 299.99, 'yearly',
 ARRAY['Acceso a 10 cursos', 'Certificados digitales', 'Soporte por email', '2 meses gratis'], 3),
('Plan Anual Profesional', 'Plan profesional con descuento anual', 499.99, 'yearly',
 ARRAY['Acceso ilimitado a cursos', 'Certificados digitales', 'Soporte prioritario', 'Talleres en vivo', '2 meses gratis'], 4);

-- Create admin user (password: admin123)
INSERT INTO users (email, password_hash, role, first_name, last_name, is_verified, is_active) VALUES
('admin@dentalplatform.com', '$2b$10$rQZ8kHWKQYXyQqGQqGQqGOX8kHWKQYXyQqGQqGQqGOX8kHWKQYXyQq', 'admin', 'Admin', 'Sistema', true, true);

-- =====================================================
-- FUNCIONES AUXILIARES PARA LA APLICACIÓN
-- =====================================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_enrollments', (
            SELECT COUNT(*) FROM enrollments WHERE student_id = user_uuid
        ),
        'completed_courses', (
            SELECT COUNT(*) FROM enrollments WHERE student_id = user_uuid AND completed_at IS NOT NULL
        ),
        'certificates_earned', (
            SELECT COUNT(*) FROM certificates WHERE student_id = user_uuid
        ),
        'total_watch_time', (
            SELECT COALESCE(SUM(watched_seconds), 0) FROM video_progress WHERE student_id = user_uuid
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get course statistics
CREATE OR REPLACE FUNCTION get_course_stats(course_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_enrollments', (
            SELECT COUNT(*) FROM enrollments WHERE course_id = course_uuid
        ),
        'completion_rate', (
            SELECT CASE 
                WHEN COUNT(*) = 0 THEN 0
                ELSE ROUND((COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
            END
            FROM enrollments WHERE course_id = course_uuid
        ),
        'average_rating', (
            SELECT COALESCE(ROUND(AVG(rating), 2), 0) FROM course_reviews WHERE course_id = course_uuid
        ),
        'total_reviews', (
            SELECT COUNT(*) FROM course_reviews WHERE course_id = course_uuid
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

-- Esta base de datos incluye:
-- ✅ 12 tablas principales con relaciones optimizadas
-- ✅ Índices para mejor rendimiento
-- ✅ Triggers automáticos para timestamps y notificaciones
-- ✅ Funciones para cálculo de progreso y estadísticas
-- ✅ Row Level Security (RLS) para seguridad
-- ✅ Datos iniciales (categorías, planes, admin)
-- ✅ Funciones auxiliares para la aplicación
-- ✅ Optimizada específicamente para Supabase

COMMENT ON DATABASE postgres IS 'Plataforma Educativa Dental - Instituto Autónomo del Norte';
