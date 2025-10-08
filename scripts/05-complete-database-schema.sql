-- Eliminar tablas existentes si existen
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS course_materials CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS course_categories CASCADE;
DROP TABLE IF EXISTS forum_posts CASCADE;
DROP TABLE IF EXISTS forum_topics CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS instructor_profiles CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla base de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de perfiles de estudiantes
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    bio TEXT,
    date_of_birth DATE,
    education_level VARCHAR(50),
    learning_style VARCHAR(30) CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading')),
    study_hours_per_week INTEGER DEFAULT 0,
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de perfiles de instructores
CREATE TABLE instructor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    instructor_id VARCHAR(20) UNIQUE NOT NULL,
    bio TEXT,
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    years_experience INTEGER DEFAULT 0,
    education TEXT,
    certifications TEXT[],
    hourly_rate DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de perfiles de administradores
CREATE TABLE admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_id VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100),
    permissions JSONB DEFAULT '{"manage_users": true, "manage_courses": true, "manage_payments": true, "view_analytics": true}',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de categorías de cursos
CREATE TABLE course_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#6366f1',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de cursos
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES course_categories(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    thumbnail_url TEXT,
    video_preview_url TEXT,
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration_hours INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    discount_price DECIMAL(10,2),
    is_free BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    max_students INTEGER,
    requirements TEXT[],
    what_you_learn TEXT[],
    language VARCHAR(10) DEFAULT 'es',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de lecciones de cursos
CREATE TABLE course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de materiales de curso
CREATE TABLE course_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    is_downloadable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de inscripciones a cursos
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(student_id, course_id)
);

-- Tabla de progreso de curso
CREATE TABLE course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ,
    watch_time_seconds INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    UNIQUE(enrollment_id, lesson_id)
);

-- Tabla de certificados
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    certificate_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    verification_code VARCHAR(100) UNIQUE,
    UNIQUE(student_id, course_id)
);

-- Tabla de pagos
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50),
    transaction_id VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de temas del foro
CREATE TABLE forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    total_posts INTEGER DEFAULT 0,
    last_post_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de posts del foro
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_instructor_profiles_user_id ON instructor_profiles(user_id);
CREATE INDEX idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX idx_course_progress_enrollment_id ON course_progress(enrollment_id);
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_forum_topics_course_id ON forum_topics(course_id);
CREATE INDEX idx_forum_posts_topic_id ON forum_posts(topic_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Crear triggers para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructor_profiles_updated_at BEFORE UPDATE ON instructor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar IDs únicos
CREATE OR REPLACE FUNCTION generate_student_id() RETURNS TEXT AS $$
BEGIN
    RETURN 'STU' || LPAD(nextval('student_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_instructor_id() RETURNS TEXT AS $$
BEGIN
    RETURN 'INS' || LPAD(nextval('instructor_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_admin_id() RETURNS TEXT AS $$
BEGIN
    RETURN 'ADM' || LPAD(nextval('admin_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Crear secuencias para IDs
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS instructor_id_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS admin_id_seq START 1000;

-- Triggers para crear perfiles automáticamente
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'student' THEN
        INSERT INTO student_profiles (user_id, student_id)
        VALUES (NEW.id, generate_student_id());
    ELSIF NEW.role = 'instructor' THEN
        INSERT INTO instructor_profiles (user_id, instructor_id)
        VALUES (NEW.id, generate_instructor_id());
    ELSIF NEW.role = 'admin' THEN
        INSERT INTO admin_profiles (user_id, admin_id)
        VALUES (NEW.id, generate_admin_id());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();
