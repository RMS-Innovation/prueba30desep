import { redirect } from "next/navigation"
import { getSimpleSession } from "@/lib/simple-auth"

export default async function DashboardPage() {
  const session = await getSimpleSession()

  console.log("Dashboard session:", session)

  // Si no está autenticado, redirigir al login
  if (!session?.user) {
    redirect("/auth/login")
  }

  const userRole = session.user.role || "student"

  // Redirigir según el rol del usuario
  switch (userRole) {
    case "student":
      redirect("/dashboard/student")
      break;
    case "instructor":
      redirect("/dashboard/instructor")
      break;
    case "admin":
      redirect("/dashboard/admin")
      break;
    default:
      // Si no tiene rol definido, redirigir a estudiante por defecto
      redirect("/dashboard/student")
  }
}
