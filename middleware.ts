import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers (Helmet.js equivalent)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  const { pathname } = request.nextUrl

  // Solo aplicar middleware a rutas específicas de admin e instructor
  const adminRoutes = ["/admin"]
  const instructorRoutes = ["/instructor"]

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isInstructorRoute = instructorRoutes.some((route) => pathname.startsWith(route))

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("simple-session")
  let user = null

  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie.value)
      user = sessionData.user
    } catch (error) {
      // Cookie inválida, ignorar
    }
  }

  // Check admin access
  if (isAdminRoute && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Check instructor access
  if (isInstructorRoute && !["instructor", "admin"].includes(user?.role || "")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // No interferir con las rutas de dashboard para evitar bucles

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
