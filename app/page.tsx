
// app/page.tsx
"use client"; // Necesario para animaciones, estado y hooks

import React, { useState, useEffect, useRef } from "react";
// Hook de autenticación para el header
import { useAuth } from "@/lib/auth-utils"; 
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Stethoscope,
  BookOpen,
  Shield,
  Menu,
  X,
  Quote, // Icono para testimonios
} from "lucide-react";
// GSAP para animaciones
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Para animaciones de scroll

// Registra los plugins de GSAP
gsap.registerPlugin(ScrollTrigger, useGSAP);

// --- Componente Auxiliar para Animación "Moving Border" ---
function MovingBorderButton({ children, className, ...props }: { children: React.ReactNode, className?: string } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="lg"
      className={`
        relative overflow-hidden group text-lg px-8 py-3 w-full sm:w-auto
        bg-blue-600 text-white hover:bg-blue-700
        transition-all duration-300
        ${className || ''}
      `}
      {...props}
    >
      {/* El span del borde animado */}
      <span 
        className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-300 via-blue-100 to-blue-300
                   opacity-0 group-hover:opacity-75 transition-opacity duration-300
                   animate-[spin_4s_linear_infinite]"
        aria-hidden="true"
      ></span>
      {/* El contenido */}
      <span className="relative z-10 flex items-center">
        {children}
      </span>
    </Button>
  );
}

// --- Componente Auxiliar para Animación de Scroll ---
function ScrollFadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  
  useGSAP(() => {
    if (!ref.current) return;
    
    // Anima desde (opacity: 0, y: 50) hasta (opacity: 1, y: 0)
    gsap.from(ref.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%", // Se activa cuando el 85% superior del elemento entra en la vista
        toggleActions: "play none none none",
      },
    });
  }, { scope: ref }); // Alcance de la animación al elemento ref

  return <div ref={ref}>{children}</div>;
}


// --- Componente Principal de la Página ---
export default function HomePage() {
  // Lógica del Header
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth(); // Hook para estado de sesión

  // Lógica de Animación de Texto (Hero)
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  // Tus palabras solicitadas
  const animatedWords = ["especializados", "avanzados", "profesionales"];

  useEffect(() => {
    // Cambia la palabra cada 3 segundos
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % animatedWords.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [animatedWords.length]); // Dependencia

  // Función de Logout para el menú móvil
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };
  
  return (
    // Fondo principal en "dark mode" azulado
    <div className="min-h-screen bg-slate-900 text-gray-300 overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* ===== Header Responsivo (Dark Mode / Azul) ===== */}
      <header className=""/*"border-b border-blue-900/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50"*/>
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          {/* Logo y nombre */}
          {/* <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMenuOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Plataforma Dental
              </h1>
              <p className="text-sm text-gray-400 hidden sm:block">Instituto Autónomo del Norte</p>
            </div>
          </Link> */}

          {/* Botones de autenticación (Pantalla Grande) */}
          <div className="hidden md:flex items-center space-x-2">
            {loading ? (
              <div className="h-10 w-48 rounded-md bg-slate-800 animate-pulse" />
            ) : user ? (
              <>
                <Link href="/dashboard/student">
                  <Button variant="ghost" className="text-blue-300 hover:text-white hover:bg-blue-900/50">
                    Mi Dashboard
                  </Button>
                </Link>
                <Button onClick={logout} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                {/* <Link href="/auth/login">
                  <Button variant="ghost" className="text-blue-300 hover:text-white hover:bg-blue-900/50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                    Registrarse
                  </Button>
                </Link> */}
              </>
            )}
          </div>

          {/* Botón de Menú Hamburguesa (Pantalla Pequeña) */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menú Desplegable (Pantalla Pequeña) */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-900/50 bg-slate-800 shadow-lg">
            <div className="flex flex-col space-y-2 p-4">
              {loading ? ( <div className="h-10 w-full rounded-md bg-slate-700 animate-pulse" /> )
              : user ? (
                <>
                  <Link href="/dashboard/student" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-blue-300">
                      Mi Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-blue-300">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ===== Hero Section (con fondo de imágenes y animación) ===== */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden h-screen flex items-center">
        {/* Fondo de Imágenes */}
        <div className="absolute inset-0 z-0">
          {/* Capa de Gradiente Azul Oscuro */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 z-10 opacity-80"></div>
          {/* Grid de 4 Imágenes (tonos azules/grises) */}
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full opacity-30">
            <img src="https://images.unsplash.com/photo-1599493022146-2d3c500c0f86?auto=format&fit=crop&w=800&q=80" alt="Dental background 1" className="object-cover w-full h-full filter saturate-0 brightness-75" onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/800x600/0f172a/3b82f6?text=Dental+1')}/>
            <img src="https://images.unsplash.com/photo-1616790830383-e2d5b6c8f938?auto=format&fit=crop&w=800&q=80" alt="Dental background 2" className="object-cover w-full h-full filter saturate-0 brightness-75" onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/800x600/0f172a/3b82f6?text=Dental+2')}/>
            <img src="https://images.unsplash.com/photo-1579684453403-96b63f8f1258?auto=format&fit=crop&w=800&q=80" alt="Dental background 3" className="object-cover w-full h-full filter saturate-0 brightness-75" onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/800x600/0f172a/3b82f6?text=Dental+3')}/>
            <img src="https://images.unsplash.com/photo-1606811468698-c6d933393e84?auto=format&fit=crop&w=800&q=80" alt="Dental background 4" className="object-cover w-full h-full filter saturate-0 brightness-75" onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/800x600/0f172a/3b82f6?text=Dental+4')}/>
          </div>
        </div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <ScrollFadeIn>
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border border-blue-500/50 px-4 py-1 text-sm rounded-full">
              🦷 Educación Dental de Vanguardia
            </Badge>
          </ScrollFadeIn>

          <ScrollFadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Actualiza tus conocimientos dentales con cursos
              {/* Contenedor de la animación de texto */}
              <span className="relative inline-block h-[1.2em] w-full sm:w-auto min-w-[250px] md:min-w-[450px] ml-1">
                {animatedWords.map((word, index) => (
                  <span
                    key={word}
                    className={`absolute left-0 right-0 transition-all duration-500 ease-in-out ${
                      index === currentWordIndex
                        ? "opacity-100 translate-y-0" // Palabra actual
                        : "opacity-0 -translate-y-full" // Palabra saliente
                    }`}
                    style={{ transitionDelay: index === currentWordIndex ? '250ms' : '0ms' }}
                  >
                    <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
          </ScrollFadeIn>

          <ScrollFadeIn delay={0.4}>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Accede a contenido exclusivo del Instituto Autónomo del Norte. Cursos pregrabados, talleres prácticos y
              certificaciones digitales.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                {/* Botón con Borde Móvil */}
                <MovingBorderButton className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </MovingBorderButton>
              </Link>
              <Link href="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-blue-300 border-blue-500 hover:bg-blue-900/50 hover:text-white text-lg px-8 py-3 w-full sm:w-auto"
                >
                  Ver Cursos
                </Button>
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ===== Features Section (Dark Mode / Animado) ===== */}
      <section className="py-20 md:py-24 px-4 bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <ScrollFadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">¿Por qué elegir nuestra plataforma?</h2>
              <p className="text-lg md:text-xl text-gray-400">Diseñada específicamente para profesionales dentales modernos</p>
            </div>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Característica 1 */}
            <ScrollFadeIn>
              <Card className="bg-slate-800 border border-blue-900/50 transition-all duration-300 hover:border-blue-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-600/10 rounded-xl overflow-hidden">
                <CardHeader className="p-0">
                  <img src="https://images.unsplash.com/photo-1558210433-e35b71c613c7?auto=format&fit=crop&w=600&q=80"
                       alt="Cursos Online"
                       className="rounded-t-lg h-48 w-full object-cover opacity-80"
                       onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/3b82f6?text=Cursos+Online')} />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl text-blue-400 mb-2">Cursos Especializados</CardTitle>
                  <CardDescription className="text-gray-300">
                    Contenido exclusivo sobre las últimas tecnologías y técnicas odontológicas.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollFadeIn>

            {/* Característica 2 */}
            <ScrollFadeIn delay={0.2}>
              <Card className="bg-slate-800 border border-blue-900/50 transition-all duration-300 hover:border-blue-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-600/10 rounded-xl overflow-hidden">
                <CardHeader className="p-0">
                   <img src="https://images.unsplash.com/photo-1599493022146-2d3c500c0f86?auto=format&fit=crop&w=600&q=80"
                       alt="Diagnóstico Dental"
                       className="rounded-t-lg h-48 w-full object-cover opacity-80"
                       onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/3b82f6?text=Diagnóstico')} />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl text-blue-400 mb-2">Certificaciones Digitales</CardTitle>
                  <CardDescription className="text-gray-300">
                    Obtén certificados verificables digitalmente con validación blockchain.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollFadeIn>

            {/* Característica 3 */}
            <ScrollFadeIn delay={0.4}>
              <Card className="bg-slate-800 border border-blue-900/50 transition-all duration-300 hover:border-blue-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-600/10 rounded-xl overflow-hidden">
                <CardHeader className="p-0">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                       alt="Comunidad"
                       className="rounded-t-lg h-48 w-full object-cover opacity-80"
                       onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/3b82f6?text=Comunidad')} />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl text-blue-400 mb-2">Comunidad Profesional</CardTitle>
                  <CardDescription className="text-gray-300">
                    Conecta con otros dentistas y comparte experiencias y conocimientos.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ===== NUEVA SECCIÓN: Conoce a la Doctora ===== */}
      <section className="py-20 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Columna de Imagen */}
            <ScrollFadeIn>
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea19c25.jpg?auto=format&fit=crop&w=800&q=80"
                  alt="Doctora especialista dental"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/800x600/1e293b/3b82f6?text=Dra.+Ana+Mendoza')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-bold text-white">Dra Ramos</h3>
                  <p className="text-blue-200 text-lg">Fundadoa e Instructora Principal</p>
                </div>
              </div>
            </ScrollFadeIn>
            
            {/* Columna de Texto */}
            <ScrollFadeIn delay={0.2}>
              <div>
                <Badge className="mb-4 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded-full px-4 py-1">
                  Nuestra Fundadora
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Liderando la innovación en educación dental
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Con más de 15 años de experiencia en práctica clínica e investigación, la Dra. Mendoza fundó esta plataforma con la misión de hacer accesible la educación continua de alta calidad para todos los profesionales de la odontología.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span>+15 Años de Experiencia Clínica</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span>Especialista en Implantología y Estética Dental</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span>Autora de 3 publicaciones de investigación</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-8 text-blue-300 border-blue-500 hover:bg-blue-900/50 hover:text-white">
                  Conoce su Historia
                </Button>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ===== NUEVA SECCIÓN: Testimonios ===== */}
      <section className="py-20 md:py-24 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <ScrollFadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Lo que dicen nuestros alumnos</h2>
              <p className="text-lg md:text-xl text-gray-400">Resultados reales de profesionales reales.</p>
            </div>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <ScrollFadeIn>
              <Card className="bg-slate-800 border border-blue-900/50 rounded-xl h-full flex flex-col shadow-lg">
                <CardContent className="p-8 flex flex-col flex-1">
                  <Quote className="w-8 h-8 text-blue-500 mb-6" fill="currentColor" />
                  <p className="text-gray-300 flex-1 mb-8 text-lg">"La calidad del contenido es de primer nivel. Los cursos de implantología cambiaron mi enfoque clínico y mejoraron mis resultados con pacientes."</p>
                  <div className="flex items-center space-x-4">
                    <img className="w-12 h-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Dr. Carlos Ruiz" onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1e293b/3b82f6?text=CR')}/>
                    <div>
                      <h4 className="font-semibold text-white">Dr. Carlos Ruiz</h4>
                      <p className="text-sm text-blue-300">Cirujano Dentista</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollFadeIn>
            
            {/* Testimonio 2 */}
            <ScrollFadeIn delay={0.2}>
              <Card className="bg-slate-800 border border-blue-900/50 rounded-xl h-full flex flex-col shadow-lg">
                <CardContent className="p-8 flex flex-col flex-1">
                  <Quote className="w-8 h-8 text-blue-500 mb-6" fill="currentColor" />
                  <p className="text-gray-300 flex-1 mb-8 text-lg">"Pude estudiar a mi propio ritmo sin sacrificar tiempo en la clínica. La flexibilidad de la plataforma es inigualable. 100% recomendado."</p>
                  <div className="flex items-center space-x-4">
                    <img className="w-12 h-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Dra. Sofia Vergara" onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1e293b/3b82f6?text=SV')}/>
                    <div>
                      <h4 className="font-semibold text-white">Dra. Sofía Vergara</h4>
                      <p className="text-sm text-blue-300">Especialista en Ortodoncia</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollFadeIn>

            {/* Testimonio 3 */}
            <ScrollFadeIn delay={0.4}>
              <Card className="bg-slate-800 border border-blue-900/50 rounded-xl h-full flex flex-col shadow-lg">
                <CardContent className="p-8 flex flex-col flex-1">
                  <Quote className="w-8 h-8 text-blue-500 mb-6" fill="currentColor" />
                  <p className="text-gray-300 flex-1 mb-8 text-lg">"Los talleres prácticos son fantásticos. Poder ver los procedimientos paso a paso con tanto detalle no tiene precio."</p>
                  <div className="flex items-center space-x-4">
                    <img className="w-12 h-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=100&q=80" alt="Dr. Miguel Hernandez" onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1e293b/3b82f6?text=MH')}/>
                    <div>
                      <h4 className="font-semibold text-white">Dr. Miguel Hernandez</h4>
                      <p className="text-sm text-blue-300">Odontólogo General</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ===== Benefits Section (Original) ===== */}
      <section className="py-20 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollFadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Lista de beneficios */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                  Flexibilidad total para tu crecimiento profesional
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "Acceso 24/7", text: "Estudia cuando y donde quieras, sin restricciones de horario." },
                    { title: "Contenido Actualizado", text: "Cursos constantemente actualizados con las últimas tendencias." },
                    { title: "Talleres Prácticos", text: "Sesiones hands-on para aplicar conocimientos teóricos." },
                    { title: "Soporte Experto", text: "Instructores especializados disponibles para resolver dudas." }
                  ].map((item) => (
                    <div key={item.title} className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="text-gray-300">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Testimonio Card (del código original) */}
              <ScrollFadeIn delay={0.2}>
                <Card className="bg-slate-800 border border-blue-900/50 rounded-xl shadow-xl p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Dra. María González</h3>
                      <p className="text-blue-300">Especialista en Implantología</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic text-lg">
                    "Los cursos me han permitido mantenerme actualizada. La flexibilidad de
                    horarios es perfecta para mi práctica profesional."
                  </p>
                </Card>
              </ScrollFadeIn>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ===== CTA Section (Dark Mode / Botón Animado) ===== */}
      <section className="py-20 md:py-24 px-4 bg-gradient-to-r from-blue-800 to-blue-950">
        <ScrollFadeIn>
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para impulsar tu carrera dental?</h2>
            <p className="text-xl text-blue-200 mb-8">
              Únete a cientos de profesionales que ya están actualizando sus conocimientos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                {/* Botón con Borde Móvil */}
                <MovingBorderButton className="bg-white text-blue-700 hover:bg-gray-200 shadow-lg">
                  Crear Cuenta Gratuita
                  <ArrowRight className="ml-2 w-5 h-5" />
                </MovingBorderButton>
              </Link>
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      {/* ===== Footer (Dark Mode / Azul) ===== */}
      <footer className="bg-gray-950 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
            {/* Columna 1 */}
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-200">Plataforma Dental</span>
              </div>
              <p className="text-gray-400 text-sm">
                Instituto Autónomo del Norte - Educación dental especializada.
              </p>
            </div>

            {/* Columna 2 */}
            <div>
              <h3 className="font-semibold text-white mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-blue-300 transition-colors">Cursos</Link></li>
                <li><Link href="/certificates" className="hover:text-blue-300 transition-colors">Certificaciones</Link></li>
                <li><Link href="/instructors" className="hover:text-blue-300 transition-colors">Instructores</Link></li>
              </ul>
            </div>

            {/* Columna 3 */}
            <div>
              <h3 className="font-semibold text-white mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-blue-300 transition-colors">Centro de Ayuda</Link></li>
                <li><Link href="/contact" className="hover:text-blue-300 transition-colors">Contacto</Link></li>
                <li><Link href="/faq" className="hover:text-blue-300 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Columna 4 */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-blue-300 transition-colors">Privacidad</Link></li>
                <li><Link href="/terms" className="hover:text-blue-300 transition-colors">Términos</Link></li>
                <li><Link href="/cookies" className="hover:text-blue-300 transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Instituto Autónomo del Norte. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
