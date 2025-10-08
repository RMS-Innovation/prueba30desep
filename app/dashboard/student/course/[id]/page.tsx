"use client"

import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  CheckCircle,
  Clock,
  Users,
  Download,
  MessageCircle,
  Star,
  BookOpen,
  FileText,
  Video,
  SkipForward,
  SkipBack,
  Volume2,
  Settings,
  Maximize,
} from "lucide-react"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getSession()

  if (!session?.user || session.user.role !== "student") {
    redirect("/auth/login")
  }

  // Mock data - replace with real data from database
  const course = {
    id: params.id,
    title: "Anatomía Dental Avanzada",
    description:
      "Domina los fundamentos anatómicos del sistema dental con técnicas modernas de diagnóstico y tratamiento.",
    instructor: {
      name: "Dr. María González",
      avatar: "/instructor-maria.png",
      bio: "Especialista en Anatomía Dental con 15 años de experiencia",
      rating: 4.9,
    },
    progress: 72,
    totalLessons: 12,
    completedLessons: 9,
    duration: "8 horas",
    students: 1247,
    rating: 4.8,
    thumbnail: "/dental-anatomy-course.png",
    currentVideo: {
      id: 10,
      title: "Primeros Molares",
      url: "/videos/primeros-molares.mp4",
      duration: "35:24",
      currentTime: "12:45",
    },
    modules: [
      {
        id: 1,
        title: "Introducción a la Anatomía Dental",
        lessons: [
          { id: 1, title: "Conceptos Básicos", duration: "15 min", completed: true },
          { id: 2, title: "Clasificación de Dientes", duration: "20 min", completed: true },
          { id: 3, title: "Nomenclatura Dental", duration: "18 min", completed: true },
        ],
      },
      {
        id: 2,
        title: "Anatomía de Dientes Anteriores",
        lessons: [
          { id: 4, title: "Incisivos Centrales", duration: "25 min", completed: true },
          { id: 5, title: "Incisivos Laterales", duration: "22 min", completed: true },
          { id: 6, title: "Caninos", duration: "28 min", completed: true },
        ],
      },
      {
        id: 3,
        title: "Anatomía de Premolares",
        lessons: [
          { id: 7, title: "Primeros Premolares", duration: "30 min", completed: true },
          { id: 8, title: "Segundos Premolares", duration: "25 min", completed: true },
          { id: 9, title: "Variaciones Anatómicas", duration: "20 min", completed: true },
        ],
      },
      {
        id: 4,
        title: "Anatomía de Molares",
        lessons: [
          { id: 10, title: "Primeros Molares", duration: "35 min", completed: false, current: true },
          { id: 11, title: "Segundos Molares", duration: "30 min", completed: false },
          { id: 12, title: "Terceros Molares", duration: "25 min", completed: false },
        ],
      },
    ],
    materials: [
      { id: 1, title: "Guía de Anatomía Dental.pdf", type: "pdf", size: "2.5 MB" },
      { id: 2, title: "Atlas Fotográfico.pdf", type: "pdf", size: "15.2 MB" },
      { id: 3, title: "Ejercicios Prácticos.docx", type: "doc", size: "1.8 MB" },
    ],
    discussions: [
      {
        id: 1,
        user: "Ana Martínez",
        avatar: "/student-ana.png",
        question: "¿Cuáles son las principales diferencias entre los primeros y segundos molares?",
        time: "hace 2 horas",
        replies: 3,
        likes: 5,
      },
      {
        id: 2,
        user: "Carlos López",
        avatar: "/student-carlos.png",
        question: "¿Podrían explicar más sobre las variaciones anatómicas en caninos?",
        time: "hace 1 día",
        replies: 7,
        likes: 12,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="md:ml-64">
        <div className="p-6">
          {/* Course Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students.toLocaleString()} estudiantes
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {course.rating}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso del Curso</span>
                <span className="text-sm text-gray-600">
                  {course.completedLessons}/{course.totalLessons} lecciones
                </span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{course.progress}% completado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player and Course Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-0">
                  <div className="relative bg-black rounded-t-lg">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                        <h3 className="text-xl font-semibold mb-2">{course.currentVideo.title}</h3>
                        <p className="text-gray-300">Duración: {course.currentVideo.duration}</p>
                      </div>
                    </div>

                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center space-x-4 text-white">
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <SkipForward className="w-4 h-4" />
                        </Button>

                        <div className="flex-1 mx-4">
                          <div className="bg-white/30 rounded-full h-1">
                            <div className="bg-purple-500 h-1 rounded-full" style={{ width: "36%" }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>{course.currentVideo.currentTime}</span>
                            <span>{course.currentVideo.duration}</span>
                          </div>
                        </div>

                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.currentVideo.title}</h3>
                        <p className="text-sm text-gray-600">Lección 10 de 12</p>
                      </div>
                      <Button
                        className="bg-purple-800 hover:bg-purple-900"
                        onClick={() => {
                          console.log("Marking lesson as completed")
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Completada
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="lessons" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="lessons">Lecciones</TabsTrigger>
                  <TabsTrigger value="materials">Materiales</TabsTrigger>
                  <TabsTrigger value="discussions">Discusiones</TabsTrigger>
                </TabsList>

                <TabsContent value="lessons" className="space-y-4">
                  {course.modules.map((module) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                                lesson.current
                                  ? "bg-purple-50 border-purple-200"
                                  : lesson.completed
                                    ? "bg-green-50 border-green-200"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                console.log(`Playing lesson: ${lesson.title}`)
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                {lesson.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : lesson.current ? (
                                  <Play className="w-5 h-5 text-purple-600" />
                                ) : (
                                  <Video className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  <p className="text-sm text-gray-600">{lesson.duration}</p>
                                </div>
                              </div>

                              <Button
                                size="sm"
                                variant={lesson.current ? "default" : lesson.completed ? "outline" : "ghost"}
                                className={lesson.current ? "bg-purple-800 hover:bg-purple-900" : ""}
                              >
                                {lesson.completed ? "Revisar" : lesson.current ? "Continuar" : "Ver"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="materials" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Download className="w-5 h-5 mr-2" />
                        Materiales del Curso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {course.materials.map((material) => (
                          <div
                            key={material.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">{material.title}</h4>
                                <p className="text-sm text-gray-600">{material.size}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                console.log(`Downloading: ${material.title}`)
                              }}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Descargar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discussions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Hacer una Pregunta
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="¿Tienes alguna pregunta sobre este curso? Compártela con la comunidad..."
                          rows={3}
                        />
                        <Button className="bg-purple-800 hover:bg-purple-900">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Publicar Pregunta
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Discusiones Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {course.discussions.map((discussion) => (
                          <div key={discussion.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={discussion.avatar || "/placeholder.svg"} alt={discussion.user} />
                                <AvatarFallback>{discussion.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{discussion.user}</span>
                                  <span className="text-sm text-gray-500">{discussion.time}</span>
                                </div>
                                <p className="text-gray-700 mb-2">{discussion.question}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <button className="flex items-center hover:text-purple-600">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    {discussion.replies} respuestas
                                  </button>
                                  <button className="flex items-center hover:text-purple-600">
                                    <Star className="w-4 h-4 mr-1" />
                                    {discussion.likes} me gusta
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Instructor Info and Certificate */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tu Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={course.instructor.avatar || "/placeholder.svg"} alt={course.instructor.name} />
                      <AvatarFallback>MG</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.instructor.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">{course.instructor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{course.instructor.bio}</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar Instructor
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certificado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-8 h-8 text-purple-800" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Obtén tu Certificado</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Completa todas las lecciones para obtener tu certificado digital verificado.
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                      {course.totalLessons - course.completedLessons} lecciones restantes
                    </div>
                    {course.progress === 100 && (
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar Certificado
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navegación del Curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <SkipBack className="w-4 h-4 mr-2" />
                    Lección Anterior
                  </Button>
                  <Button className="w-full justify-start bg-purple-800 hover:bg-purple-900">
                    <SkipForward className="w-4 h-4 mr-2" />
                    Siguiente Lección
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
