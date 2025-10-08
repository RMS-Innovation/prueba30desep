-- Seeding initial data for the platform

-- Insert default categories
INSERT INTO categories (name, description, slug) VALUES
('Endodoncia', 'Cursos especializados en tratamientos de conducto y endodoncia', 'endodoncia'),
('Ortodoncia', 'Cursos de ortodoncia y alineación dental', 'ortodoncia'),
('Implantología', 'Cursos de implantes dentales y cirugía oral', 'implantologia'),
('Estética Dental', 'Cursos de odontología estética y cosmética', 'estetica-dental'),
('Periodoncia', 'Cursos de tratamiento de encías y periodonto', 'periodoncia'),
('Odontopediatría', 'Cursos especializados en odontología infantil', 'odontopediatria'),
('Cirugía Oral', 'Cursos de cirugía oral y maxilofacial', 'cirugia-oral'),
('Prótesis Dental', 'Cursos de prótesis fijas y removibles', 'protesis-dental');

-- Insert subscription plans
INSERT INTO subscription_plans (name, description, price, billing_interval, features) VALUES
('Plan Básico', 'Acceso a cursos básicos y contenido introductorio', 29.99, 'monthly', 
 ARRAY['Acceso a cursos básicos', 'Certificados digitales', 'Soporte por email']),
('Plan Profesional', 'Acceso completo a todos los cursos y talleres', 49.99, 'monthly',
 ARRAY['Acceso a todos los cursos', 'Talleres en vivo', 'Certificados digitales', 'Soporte prioritario', 'Descarga de materiales']),
('Plan Anual Básico', 'Plan básico con descuento anual', 299.99, 'yearly',
 ARRAY['Acceso a cursos básicos', 'Certificados digitales', 'Soporte por email', '2 meses gratis']),
('Plan Anual Profesional', 'Plan profesional con descuento anual', 499.99, 'yearly',
 ARRAY['Acceso a todos los cursos', 'Talleres en vivo', 'Certificados digitales', 'Soporte prioritario', 'Descarga de materiales', '2 meses gratis']);

-- Insert admin user (password will be hashed in the application)
INSERT INTO users (email, password_hash, role, first_name, last_name, is_verified) VALUES
('admin@rgservicios.com', '$2b$10$placeholder', 'admin', 'Administrador', 'Sistema', true);
