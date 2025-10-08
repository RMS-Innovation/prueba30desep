import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, BookOpen, Award, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Instructores Expertos | Plataforma Educativa Dental",
  description: "Conoce a nuestros instructores expertos en odontología con años de experiencia clínica y académica.",
}

export default function InstructoresPage() {
  const instructors = [
    {
      id: 1,
      name: "Dra. María González",
      specialty: "Ortodoncia y Ortopedia Maxilofacial",
      image: "/instructor-maria-gonzalez.png",
      rating: 4.9,
      students: 1250,
      courses: 8,
      experience: "15 años",
      location: "Ciudad de México",
      bio: "Especialista en ortodoncia con certificación internacional. Pionera en técnicas de ortodoncia digital y alineadores transparentes.",
      achievements: ["Certificación Invisalign Diamond", "Miembro de la AAO", "Más de 3000 casos tratados"],
      education: "Universidad Nacional Autónoma de México",
    },
    {
      id: 2,
      name: "Dr. Carlos Rodríguez",
      specialty: "Implantología y Cirugía Oral",
      image: "/instructor-carlos-rodriguez.png",
      rating: 4.8,
      students: 980,
      courses: 6,
      experience: "12 años",
      location: "Guadalajara",
      bio: "Cirujano oral especializado en implantología avanzada. Experto en técnicas de regeneración ósea y carga inmediata.",
      achievements: ["Certificación ITI", "Fellow ICOI", "Más de 5000 implantes colocados"],
      education: "Universidad de Guadalajara",
    },
    {
      id: 3,
      name: "Dra. Ana Martínez",
      specialty: "Endodoncia y Odontología Restauradora",
      image: "/instructor-ana-martinez.png",
      rating: 4.9,
      students: 750,
      courses: 5,
      experience: "10 años",
      location: "Monterrey",
      bio: "Endodoncista con especialización en microscopía dental. Experta en tratamientos de conductos complejos y retratamientos.",
      achievements: ["Certificación en Microscopía", "Miembro de la AAE", "Tasa de éxito del 98%"],
      education: "Universidad Autónoma de Nuevo León",
    },
    {
      id: 4,
      name: "Dr. Luis Fernández",
      specialty: "Periodoncia y Medicina Oral",
      image: "/instructor-luis-fernandez.png",
      rating: 4.7,
      students: 650,
      courses: 4,
      experience: "14 años",
      location: "Puebla",
      bio: "Periodoncista especializado en tratamientos regenerativos y estética periodontal. Investigador en terapias con células madre.",
      achievements: ["Certificación EFP", "Publicaciones científicas", "Investigador principal"],
      education: "Benemérita Universidad Autónoma de Puebla",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nuestros Instructores Expertos</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Aprende de los mejores profesionales en odontología con años de experiencia clínica y académica reconocida
              internacionalmente
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Estadísticas */}
        <section className="mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "25+", label: "Instructores Expertos", icon: Users },
              { number: "150+", label: "Años de Experiencia Combinada", icon: Calendar },
              { number: "50+", label: "Cursos Especializados", icon: BookOpen },
              { number: "15,000+", label: "Estudiantes Formados", icon: Award },
            ].map((stat, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <stat.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Lista de Instructores */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Conoce a Nuestros Expertos</h2>
          <div className="space-y-8">
            {instructors.map((instructor, index) => (
              <Card key={instructor.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  {/* Imagen y Info Básica */}
                  <div className="text-center lg:text-left">
                    <div className="relative w-48 h-48 mx-auto lg:mx-0 mb-6">
                      <Image
                        src={instructor.image || "/placeholder.svg"}
                        alt={instructor.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{instructor.name}</h3>
                    <p className="text-purple-600 font-semibold mb-4">{instructor.specialty}</p>

                    {/* Estadísticas */}
                    <div className="flex justify-center lg:justify-start space-x-6 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{instructor.rating}</span>
                        </div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{instructor.students}</div>
                        <div className="text-sm text-gray-500">Estudiantes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{instructor.courses}</div>
                        <div className="text-sm text-gray-500">Cursos</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{instructor.location}</span>
                    </div>
                    <Badge variant="secondary">{instructor.experience} de experiencia</Badge>
                  </div>

                  {/* Información Detallada */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Biografía</h4>
                      <p className="text-gray-700 leading-relaxed">{instructor.bio}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Formación Académica</h4>
                      <p className="text-gray-700">{instructor.education}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Logros y Certificaciones</h4>
                      <div className="flex flex-wrap gap-2">
                        {instructor.achievements.map((achievement, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="bg-purple-600 hover:bg-purple-700">Ver Cursos</Button>
                      <Button variant="outline">Contactar Instructor</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA para Instructores */}
        <section className="text-center">
          <Card className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">¿Eres un experto en odontología?</CardTitle>
              <CardDescription className="text-lg">
                Únete a nuestro equipo de instructores y comparte tu conocimiento con miles de profesionales en todo el
                mundo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Aplicar como Instructor
                </Button>
                <Button size="lg" variant="outline">
                  Más Información
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
