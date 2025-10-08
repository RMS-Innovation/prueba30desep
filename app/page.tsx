import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  GraduationCap,
  Award,
  Users,
  PlayCircle,
  CheckCircle,
  Star,
  ArrowRight,
  Stethoscope,
  BookOpen,
  Shield,
} from "lucide-react"

export default async function HomePage() {
  const session = await getSession()

  // If user is authenticated, redirect to their dashboard
  if (session?.user) {
    switch (session.user.role) {
      case "admin":
        return <script>window.location.href = "/dashboard/admin"</script>
      case "instructor":
        return <script>window.location.href = "/dashboard/instructor"</script>
      case "student":
      default:
        return <script>window.location.href = "/dashboard/student"</script>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Plataforma Educativa Dental
              </h1>
              <p className="text-sm text-gray-600">Instituto Autónomo del Norte</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-purple-700 hover:text-purple-800">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
            🦷 Educación Dental Especializada
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent leading-tight">
            Actualiza tus conocimientos dentales con cursos especializados
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Accede a contenido exclusivo del Instituto Autónomo del Norte. Cursos pregrabados, talleres prácticos y
            certificaciones digitales para profesionales dentales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg px-8 py-3"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 text-lg px-8 py-3 bg-transparent"
            >
              <PlayCircle className="mr-2 w-5 h-5" />
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">¿Por qué elegir nuestra plataforma?</h2>
            <p className="text-xl text-gray-600">Diseñada específicamente para profesionales dentales modernos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-900">Cursos Especializados</CardTitle>
                <CardDescription>
                  Contenido exclusivo sobre las últimas tecnologías y técnicas odontológicas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-900">Certificaciones Digitales</CardTitle>
                <CardDescription>
                  Obtén certificados verificables digitalmente con validación blockchain
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-900">Comunidad Profesional</CardTitle>
                <CardDescription>Conecta con otros dentistas y comparte experiencias y conocimientos</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-purple-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Flexibilidad total para tu crecimiento profesional
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Acceso 24/7</h3>
                    <p className="text-gray-600">Estudia cuando y donde quieras, sin restricciones de horario</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Contenido Actualizado</h3>
                    <p className="text-gray-600">Cursos constantemente actualizados con las últimas tendencias</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Talleres Prácticos</h3>
                    <p className="text-gray-600">Sesiones hands-on para aplicar conocimientos teóricos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Soporte Experto</h3>
                    <p className="text-gray-600">Instructores especializados disponibles para resolver dudas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Dr. María González</h3>
                    <p className="text-gray-600">Especialista en Implantología</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Los cursos me han permitido mantenerme actualizada con las últimas técnicas. La flexibilidad de
                  horarios es perfecta para mi práctica profesional."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para impulsar tu carrera dental?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Únete a cientos de profesionales que ya están actualizando sus conocimientos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-3">
                Crear Cuenta Gratuita
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-700 text-lg px-8 py-3 bg-transparent"
            >
              <Shield className="mr-2 w-5 h-5" />
              Ver Planes
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">Plataforma Educativa Dental</span>
              </div>
              <p className="text-gray-400">
                Instituto Autónomo del Norte - Educación dental especializada para profesionales modernos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/courses" className="hover:text-white">
                    Cursos
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className="hover:text-white">
                    Certificaciones
                  </Link>
                </li>
                <li>
                  <Link href="/instructors" className="hover:text-white">
                    Instructores
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Instituto Autónomo del Norte. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
