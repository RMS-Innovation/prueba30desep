// app/components/header.tsx

"use client"; // <-- Convertido a Componente de Cliente

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Asegúrate de importar Button
import { useAuth } from '@/lib/auth-utils'; // Importa el hook de autenticación

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Usamos el hook de autenticación para saber si el usuario está logueado
  // y para obtener la función de logout.
  // 'loading' evita mostrar botones incorrectos mientras se carga la sesión.
  const { user, logout, loading } = useAuth();

  // Función para cerrar sesión y el menú móvil
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Determina qué botones mostrar
  const renderAuthButtons = () => {
    if (loading) {
      return <div className="h-10 w-24 rounded-md bg-slate-800 animate-pulse" />; // Skeleton loader
    }

    if (user) {
      // Usuario logueado
      return (
        <>
          <Link href="/dashboard/student" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start md:w-auto md:justify-center text-purple-700">
              Mi Dashboard
            </Button>
          </Link>
          <Button onClick={handleLogout} className="w-full md:w-auto bg-red-600 hover:bg-red-700">
            Cerrar Sesión
          </Button>
        </>
      );
    }

    // Usuario no logueado
    return (
      <>
        <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
          <Button variant="ghost" className="w-full justify-start md:w-auto md:justify-center text-purple-700 hover:text-purple-800">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
          <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
            Registrarse
          </Button>
        </Link>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full  bg-slate-800 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo y nombre (sin cambios) */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <GraduationCap className="h-6 w-6 text-purple-700" />
          <span className="text-lg font-bold text-gray-900">
            Dental LMS
          </span>
        </Link>

        {/* Botones de autenticación (Pantalla Grande) */}
        <div className="hidden md:flex items-center space-x-4">
          {renderAuthButtons()}
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
            {renderAuthButtons()}
          </div>
        </div>
      )}
    </header>
  );
}