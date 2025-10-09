// app/components/Header.tsx

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4">
        {/* Este enlace envuelve el logo y el nombre, apuntando a la página de inicio ("/") */}
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-purple-700" />
          <span className="text-lg font-bold text-gray-900">
            Dental LMS
          </span>
        </Link>
        {/* Aquí podrías agregar más enlaces en el futuro si lo necesitas */}
      </div>
    </header>
  );
}