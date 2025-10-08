"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Star, Play, Download, CheckCircle, BookOpen, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CourseDetail {
  id: string
  title: string
  description: string
  long_description: string
  instructor_name: string
  instructor_bio: string
  instructor_avatar?: string
  price: number
  duration_hours: number
  level: "beginner" | "intermediate" | "advanced"
  category: string
  thumbnail_url?: string
  rating: number
  student_count: number
  created_at: string
  modules: Module[]
  requirements: string[]
  what_you_learn: string[]
  materials: Material[]
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  duration_minutes: number
  is_preview: boolean
}

interface Material {
  id: string
  title: string
  type: "pdf" | "image" | "link"
  url: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCourse: CourseDetail = {
      id: params.id as string,
      title: "Endodoncia Avanzada: Técnicas Modernas",
      description: "Aprende las técnicas más avanzadas en endodoncia con casos clínicos reales y práctica guiada.",
      long_description:
        "Este curso integral de endodoncia avanzada está diseñado para profesionales que buscan perfeccionar sus habilidades en el tratamiento de conductos radiculares. A través de casos clínicos reales, técnicas de vanguardia y práctica guiada, los participantes desarrollarán la expertise necesaria para manejar los casos más complejos con confianza y precisión.",
      instructor_name: "Dr. María González",
      instructor_bio:
        "Especialista en Endodoncia con más de 15 años de experiencia. Profesora titular en la Universidad Nacional y autora de múltiples publicaciones científicas.",
      instructor_avatar: "/professional-woman-doctor.png",
      price: 299.99,
      duration_hours: 12,
      level: "advanced",
      category: "Endodoncia",
      thumbnail_url: "/advanced-endodontics-course.png",
      rating: 4.8,
      student_count: 245,
      created_at: "2024-01-15",
      modules: [
        {
          id: "1",
          title: "Fundamentos de Endodoncia Moderna",
          lessons: [
            { id: "1", title: "Anatomía radicular avanzada", duration_minutes: 45, is_preview: true },
            { id: "2", title: "Instrumentación rotatoria", duration_minutes: 60, is_preview: false },
            { id: "3", title: "Irrigación y desinfección", duration_minutes: 50, is_preview: false },
          ],
        },
        {
          id: "2",
          title: "Técnicas de Obturación",
          lessons: [
            { id: "4", title: "Técnica de condensación lateral", duration_minutes: 55, is_preview: false },
            { id: "5", title: "Obturación termoplástica", duration_minutes: 65, is_preview: false },
            { id: "6", title: "Casos complejos", duration_minutes: 70, is_preview: false },
          ],
        },
        {
          id: "3",
          title: "Casos Clínicos Prácticos",
          lessons: [
            { id: "7", title: "Retratamiento endodóntico", duration_minutes: 80, is_preview: false },
            { id: "8", title: "Perforaciones radiculares", duration_minutes: 60, is_preview: false },
            { id: "9", title: "Endodoncia quirúrgica", duration_minutes: 75, is_preview: false },
          ],
        },
      ],
      requirements: [
        "Título profesional en Odontología",
        "Conocimientos básicos de endodoncia",
        "Experiencia clínica mínima de 2 años",
        "Acceso a instrumental endodóntico básico",
      ],
      what_you_learn: [
        "Dominar técnicas avanzadas de instrumentación",
        "Aplicar protocolos de irrigación modernos",
        "Resolver casos complejos con confianza",
        "Implementar tecnología digital en endodoncia",
        "Manejar complicaciones endodónticas",
        "Optimizar el pronóstico de tratamientos",
      ],
      materials: [
        { id: "1", title: "Manual de Endodoncia Avanzada", type: "pdf", url: "/materials/manual-endodoncia.pdf" },
        { id: "2", title: "Atlas de Casos Clínicos", type: "pdf", url: "/materials/atlas-casos.pdf" },
        { id: "3", title: "Protocolos de Irrigación", type: "pdf", url: "/materials/protocolos.pdf" },
        { id: "4", title: "Recursos Adicionales", type: "link", url: "https://endodoncia-recursos.com" },
      ],
    }

    setTimeout(() => {
      setCourse(mockCourse)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Principiante"
      case "intermediate":
        return "Intermedio"
      case "advanced":
        return "Avanzado"
      default:
        return level
    }
  }

  const totalLessons = course?.modules.reduce((acc, module) => acc + module.lessons.length, 0) || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Curso no encontrado</h1>
          <p className="text-gray-600 mb-4">El curso que buscas no existe o ha sido removido.</p>
          <Link href="/courses">
            <Button>Volver al Catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <Image
              src={course.thumbnail_url || "/placeholder.svg?height=400&width=800&query=dental+course"}
              alt={course.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                <Play className="h-5 w-5 mr-2" />
                Vista Previa del Curso
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge className={getLevelColor(course.level)}>{getLevelText(course.level)}</Badge>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>

              <p className="text-lg text-gray-600 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {course.rating} ({course.student_count} estudiantes)
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration_hours} horas
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {totalLessons} lecciones
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={course.instructor_avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {course.instructor_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">Instructor</h3>
                  <p className="font-medium text-purple-600">{course.instructor_name}</p>
                  <p className="text-sm text-gray-600">{course.instructor_bio}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="bg-white rounded-lg shadow-sm">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Descripción</TabsTrigger>
                <TabsTrigger value="curriculum">Contenido</TabsTrigger>
                <TabsTrigger value="materials">Materiales</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Acerca de este curso</h3>
                    <p className="text-gray-600 leading-relaxed">{course.long_description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Lo que aprenderás</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {course.what_you_learn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Requisitos</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="p-6">
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Módulo {moduleIndex + 1}: {module.title}
                        </CardTitle>
                        <CardDescription>{module.lessons.length} lecciones</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Play className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">
                                  {lessonIndex + 1}. {lesson.title}
                                </span>
                                {lesson.is_preview && (
                                  <Badge variant="outline" className="text-xs">
                                    Vista Previa
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{lesson.duration_minutes} min</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="materials" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Materiales del curso</h3>
                  <div className="grid gap-4">
                    {course.materials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Download className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">{material.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {material.type.toUpperCase()}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Descargar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6">
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Próximamente: Sistema de Reseñas</h3>
                  <p className="text-gray-600">Las reseñas de estudiantes estarán disponibles pronto</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">${course.price}</div>
                  <p className="text-sm text-gray-600">Acceso de por vida</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEnrolled ? (
                  <>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                      Inscribirse Ahora
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Agregar al Carrito
                    </Button>
                  </>
                ) : (
                  <Button className="w-full" size="lg">
                    Continuar Curso
                  </Button>
                )}

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-medium">{course.duration_hours} horas</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lecciones:</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nivel:</span>
                    <span className="font-medium">{getLevelText(course.level)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Certificado:</span>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Incluido</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
