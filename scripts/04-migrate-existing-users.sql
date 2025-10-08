-- Script para migrar usuarios existentes a la nueva estructura
-- IMPORTANTE: Ejecutar solo si ya tienes datos en la tabla users actual

-- Migrar estudiantes existentes
INSERT INTO students (id, student_id, created_at, updated_at)
SELECT 
    id,
    'STU' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 6, '0'),
    created_at,
    updated_at
FROM users 
WHERE role = 'student'
ON CONFLICT (id) DO NOTHING;

-- Migrar instructores existentes
INSERT INTO instructors (id, instructor_id, bio, specialization, license_number, created_at, updated_at)
SELECT 
    id,
    'INS' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 6, '0'),
    bio,
    specialization,
    license_number,
    created_at,
    updated_at
FROM users 
WHERE role = 'instructor'
ON CONFLICT (id) DO NOTHING;

-- Migrar administradores existentes
INSERT INTO admins (id, admin_id, created_at, updated_at)
SELECT 
    id,
    'ADM' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 6, '0'),
    created_at,
    updated_at
FROM users 
WHERE role = 'admin'
ON CONFLICT (id) DO NOTHING;

-- Actualizar secuencias para evitar conflictos futuros
SELECT setval('student_id_seq', (SELECT COUNT(*) FROM students) + 1000);
SELECT setval('instructor_id_seq', (SELECT COUNT(*) FROM instructors) + 1000);
SELECT setval('admin_id_seq', (SELECT COUNT(*) FROM admins) + 1000);
