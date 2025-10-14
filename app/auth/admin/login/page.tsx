import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground">Secure access to platform administration</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
