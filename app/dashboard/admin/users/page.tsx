// app/(dashboard)/admin/users/page.tsx

"use client"; // <-- ¡Esto lo convierte en un Componente de Cliente!

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation"; // <-- Importa useRouter
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/lib/auth-utils"; // Importamos el hook de auth
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "@/components/admin/users-table"; // Asegúrate que la ruta sea correcta
import { Users, GraduationCap } from "lucide-react";

// Definición del tipo User (debe coincidir con el de UsersTable)
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
  profile_image_url: string | null;
}

export default function UsersPage() {
  const { user: sessionUser, loading: authLoading } = useAuth(); // Usamos el hook de auth
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [studentUsers, setStudentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter(); // <-- Inicializa el router

  // Efecto para verificar la sesión y cargar datos
  useEffect(() => {
    if (authLoading) return; // Espera a que la autenticación termine de cargar

    // 1. Verificación de seguridad en el cliente
    if (!sessionUser || sessionUser.role !== "admin") {
      redirect("/login/admin"); // Redirige si no es admin
    }
    
    // 2. Obtener los datos de los usuarios
    const fetchUsers = async () => {
      setLoading(true);
      // Obtiene todos los usuarios
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order("created_at", { ascending: false });

      // Obtiene solo los estudiantes (con datos de 'users' anidados)
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`*, users ( * )`)
        .order("created_at", { ascending: false });

      if (usersError) console.error("Error fetching users:", usersError.message);
      if (studentsError) console.error("Error fetching students:", studentsError.message);

      if (usersData) setAllUsers(usersData as User[]);
      
      // Transforma los datos de estudiantes al formato de 'User'
      const transformedStudents = (studentsData || []).map((student: any) => ({
        ...student.users, // Expande todos los campos de 'users'
        role: "student", // Sobrescribe el rol para asegurar
        is_active: student.users.is_active,
        created_at: student.users.created_at,
        last_login: student.users.last_login,
        profile_image_url: student.users.profile_image_url
      }));
      setStudentUsers(transformedStudents as User[]);

      setLoading(false);
    };

    if (sessionUser) { // Solo busca datos si el usuario es admin
      fetchUsers();
    }
  }, [sessionUser, authLoading, supabase]); // Depende de la sesión

  // ==========================================================
  // LÓGICA INTERACTIVA: Se define aquí en el Componente de Cliente
  // ==========================================================
  
  const handleViewUser = (userId: string) => {
    console.log("Viewing user details:", userId);
    router.push(`/dashboard/admin/users/${userId}`); // Ejemplo de navegación
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    const newStatus = !isActive;
    console.log("Toggling status for user:", userId, "to", newStatus);
    
    const { error } = await supabase
      .from('users')
      .update({ is_active: newStatus })
      .eq('id', userId);
      
    if (error) {
      console.error("Error toggling status:", error.message);
      alert("Error al actualizar el estado.");
    } else {
      // Actualiza el estado localmente para reflejar el cambio
      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
      setStudentUsers(studentUsers.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
    }
  };

  const handleSendEmail = (userId: string) => {
    const user = allUsers.find(u => u.id === userId) || studentUsers.find(u => u.id === userId);
    if (user) {
      console.log("Sending email to:", user.email);
      window.location.href = `mailto:${user.email}`;
    }
  };
  
  // ==========================================================
  // FIN DE LA LÓGICA INTERACTIVA
  // ==========================================================

  if (loading || authLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage all users, students, and their accounts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentUsers.length}</div>
            <p className="text-xs text-muted-foreground">Active student accounts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage all registered users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Ahora es válido pasar estas funciones */}
              <UsersTable
                users={allUsers}
                onViewUser={handleViewUser}
                onToggleStatus={handleToggleStatus}
                onSendEmail={handleSendEmail}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>View and manage student accounts and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Ahora es válido pasar estas funciones */}
              <UsersTable
                users={studentUsers}
                onViewUser={handleViewUser}
                onToggleStatus={handleToggleStatus}
                onSendEmail={handleSendEmail}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}