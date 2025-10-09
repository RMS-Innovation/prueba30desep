import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Shield, Award, Verified, QrCode } from "lucide-react"

export const metadata: Metadata = {
  title: "Certificaciones Digitales | Plataforma Educativa Dental",
  description:
    "Obtén certificaciones digitales verificables al completar nuestros cursos especializados en odontología.",
}

export default function CertificacionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Certificaciones Digitales</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Obtén certificaciones verificables y reconocidas en el sector odontológico al completar nuestros cursos
              especializados
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Proceso de Certificación */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Proceso de Certificación</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Completa el Curso",
                description: "Finaliza todas las lecciones y evaluaciones del curso",
                icon: CheckCircle,
              },
              {
                step: "2",
                title: "Evaluación Final",
                description: "Aprueba el examen final con calificación mínima del 80%",
                icon: Verified,
              },
              {
                step: "3",
                title: "Generación Automática",
                description: "El sistema genera tu certificado digital automáticamente",
                icon: Award,
              },
              {
                step: "4",
                title: "Verificación",
                description: "Recibe tu certificado con código QR para verificación",
                icon: QrCode,
              },
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <Badge variant="secondary" className="w-8 h-8 rounded-full mx-auto mb-2">
                    {item.step}
                  </Badge>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Características de los Certificados */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Certificados Verificables y Seguros</h2>
              <div className="space-y-4">
                {[
                  "Firma digital con tecnología blockchain",
                  "Código QR único para verificación instantánea",
                  "Validez internacional reconocida",
                  "Imposible de falsificar o duplicar",
                  "Acceso permanente desde tu perfil",
                  "Descarga en formato PDF de alta calidad",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8">
              <div className="text-center">
                <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Certificado de Ejemplo</h3>
                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border-2 border-purple-200">
                  <div className="text-sm text-gray-600 mb-2">Instituto Autónomo del Norte</div>
                  <div className="font-bold text-lg mb-2">Certificado de Finalización</div>
                  <div className="text-sm mb-4">Ortodoncia Digital Avanzada</div>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>ID: #ODO-2024-001</span>
                    <span>Verificable</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Cursos Certificables */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Cursos con Certificación Disponible</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Ortodoncia Digital",
                duration: "40 horas",
                level: "Avanzado",
                students: "1,250+",
              },
              {
                title: "Implantología Dental",
                duration: "35 horas",
                level: "Intermedio",
                students: "980+",
              },
              {
                title: "Endodoncia Moderna",
                duration: "30 horas",
                level: "Avanzado",
                students: "750+",
              },
              {
                title: "Periodoncia Clínica",
                duration: "25 horas",
                level: "Intermedio",
                students: "650+",
              },
              {
                title: "Odontopediatría",
                duration: "28 horas",
                level: "Básico",
                students: "890+",
              },
              {
                title: "Cirugía Oral",
                duration: "45 horas",
                level: "Avanzado",
                students: "420+",
              },
            ].map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{course.level}</Badge>
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{course.students} estudiantes</span>
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">¿Listo para obtener tu certificación?</CardTitle>
              <CardDescription className="text-lg">
                Explora nuestros cursos y comienza tu camino hacia la certificación profesional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Ver Cursos Disponibles
                </Button>
                <Button size="lg" variant="outline">
                  Verificar Certificado
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
