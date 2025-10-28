// app/(dashboard)/admin/layout.tsx

import type React from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
// ==========================================================
// INICIO CORRECCIÓN: Usamos la función de sesión unificada
// ==========================================================
import { getSimpleSession } from "@/lib/simple-auth"; // <-- 1. Importa la función correcta
// Se elimina: import { getAdminUser } from "@/lib/auth/admin"
// ==========================================================
// FIN CORRECCIÓN
// ==========================================================

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ==========================================================
  // INICIO CORRECCIÓN: Lógica de verificación unificada
  // ==========================================================
  // 2. Llama a la función de sesión correcta
  const { user: sessionUser, isLoggedIn } = await getSimpleSession();

  // 3. Verifica si hay sesión Y si el rol es 'admin'
  if (!isLoggedIn || !sessionUser || sessionUser.role !== "admin") {
    // 4. Redirige a la PÁGINA DE LOGIN correcta, no al 404
    redirect("/login/admin"); // O '/auth/admin/login' si esa es tu ruta
  }
  // ==========================================================
  // FIN CORRECCIÓN
  // ==========================================================

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
