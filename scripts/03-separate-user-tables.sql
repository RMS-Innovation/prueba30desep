-- Crear tablas separadas para diferentes tipos de usuarios
-- Primero crear tabla base de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla específica para estudiantes
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE, -- ID único del estudiante
    enrollment_date DATE DEFAULT CURRENT_DATE,
    graduation_date DATE,
    current_level VARCHAR(50) DEFAULT 'beginner', -- beginner, intermediate, advanced
    total_study_hours INTEGER DEFAULT 0,
    certificates_earned INTEGER DEFAULT 0,
    preferred_learning_style VARCHAR(50), -- visual, auditory, kinesthetic, reading
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    academic_goals TEXT,
    learning_disabilities TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla específica para instructores
CREATE TABLE IF NOT EXISTS instructors (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    instructor_id VARCHAR(20) UNIQUE, -- ID único del instructor
    bio TEXT,
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    years_experience INTEGER,
    education_background TEXT,
    certifications TEXT[], -- Array de certificaciones
    languages_spoken VARCHAR(100)[] DEFAULT ARRAY['Spanish'], -- Idiomas que habla
    hourly_rate DECIMAL(10,2),
    availability JSONB, -- Horarios disponibles
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    hire_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla específica para administradores
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    admin_id VARCHAR(20) UNIQUE, -- ID único del admin
    department VARCHAR(100),
    position VARCHAR(100),
    permissions JSONB DEFAULT '{"users": true, "courses": true, "payments": true, "reports": true}',
    last_login TIMESTAMPTZ,
    login_attempts INTEGER DEFAULT 0,
    is_super_admin BOOLEAN DEFAULT false,
    managed_instructors UUID[], -- IDs de instructores que maneja
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_instructors_instructor_id ON instructors(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructors_specialization ON instructors(specialization);
CREATE INDEX IF NOT EXISTS idx_admins_admin_id ON admins(admin_id);

-- Triggers para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar IDs únicos automáticamente
CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'student' THEN
        INSERT INTO students (id, student_id) 
        VALUES (NEW.id, 'STU' || LPAD(nextval('student_id_seq')::text, 6, '0'));
    ELSIF NEW.role = 'instructor' THEN
        INSERT INTO instructors (id, instructor_id) 
        VALUES (NEW.id, 'INS' || LPAD(nextval('instructor_id_seq')::text, 6, '0'));
    ELSIF NEW.role = 'admin' THEN
        INSERT INTO admins (id, admin_id) 
        VALUES (NEW.id, 'ADM' || LPAD(nextval('admin_id_seq')::text, 6, '0'));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear secuencias para IDs únicos
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS instructor_id_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS admin_id_seq START 1000;

-- Trigger para crear registro en tabla específica automáticamente
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION generate_user_id();
