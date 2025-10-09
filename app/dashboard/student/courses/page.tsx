"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, Play, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentAvatar } from "@/components/ui/student-avatar"

interface Course {
  id: number
  title: string
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  instructor: string
  thumbnail: string
  duration: string
  students: number
  rating: number
  category: string
  status: "in_progress" | "completed" | "not_started"
}

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const mockCourses: Course[] = [
    {
      id: 1,
      title: "Anatomía Dental Avanzada",
      description: "Curso completo sobre anatomía dental con casos clínicos reales",
      progress: 72,
      totalLessons: 12,
      completedLessons: 9,
      instructor: "Dr. María González",
      thumbnail: "/dental-anatomy-course.png",
      duration: "8 horas",
      students: 245,
      rating: 4.8,
      category: "anatomia",
      status: "in_progress",
    },
    {
      id: 2,
      title: "Técnicas de Endodoncia",
      description: "Aprende las técnicas más avanzadas en endodoncia moderna",
      progress: 45,
      totalLessons: 15,
      completedLessons: 7,
      instructor: "Dr. Carlos Ruiz",
      thumbnail: "/endodontics-course.png",
      duration: "12 horas",
      students: 189,
      rating: 4.9,
      category: "endodoncia",
      status: "in_progress",
    },
    {
      id: 3,
      title: "Prostodoncia Digital",
      description: "Domina las herramientas digitales en prostodoncia",
      progress: 100,
      totalLessons: 10,
      completedLessons: 10,
      instructor: "Dr. Ana López",
      thumbnail: "/digital-prosthodontics.png",
      duration: "6 horas",
      students: 156,
      rating: 4.7,
      category: "prostodoncia",
      status: "completed",
    },
    {
      id: 4,
      title: "Ortodoncia Moderna",
      description: "Técnicas actuales en ortodoncia y aparatología",
      progress: 25,
      totalLessons: 18,
      completedLessons: 4,
      instructor: "Dr. Luis Martín",
      thumbnail: "/orthodontics-course.png",
      duration: "15 horas",
      students: 203,
      rating: 4.6,
      category: "ortodoncia",
      status: "in_progress",
    },
    {
      id: 5,
      title: "Periodoncia Clínica",
      description: "Diagnóstico y tratamiento de enfermedades periodontales",
      progress: 0,
      totalLessons: 14,
      completedLessons: 0,
      instructor: "Dr. Carmen Silva",
      thumbnail: "/periodontics-course.png",
      duration: "10 horas",
      students: 178,
      rating: 4.5,
      category: "periodoncia",
      status: "not_started",
    },
  ]

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCourses(mockCourses)
      } catch (error) {
        console.error("Error loading courses:", error)
        setCourses(mockCourses)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
      const matchesStatus = statusFilter === "all" || course.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [courses, searchTerm, categoryFilter, statusFilter])

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setStatusFilter("all")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar userRole="student" />
        <div className="md:ml-64">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <StudentAvatar size="lg" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Cursos</h1>
                <p className="text-gray-600">Gestiona y continúa con tus cursos inscritos</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Barra de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar cursos..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtro por categoría */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="anatomia">Anatomía</SelectItem>
                  <SelectItem value="endodoncia">Endodoncia</SelectItem>
                  <SelectItem value="prostodoncia">Prostodoncia</SelectItem>
                  <SelectItem value="ortodoncia">Ortodoncia</SelectItem>
                  <SelectItem value="periodoncia">Periodoncia</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por estado del curso */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estado del curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="not_started">Sin empezar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Muestra los filtros activos con badges */}
            {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Búsqueda: "{searchTerm}"
                  </Badge>
                )}
                {categoryFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Categoría: {categoryFilter}
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Estado: {statusFilter}
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  Limpiar filtros
                </Button>
              </div>
            )}

            {/* Contador de resultados */}
            <p className="text-sm text-gray-600">
              Mostrando {filteredCourses.length} de {courses.length} cursos
            </p>
          </div>

          {/* Mensaje cuando no hay resultados */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cursos</h3>
              <p className="text-gray-600 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Imagen del curso con badge de estado */}
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={cn(
                        "absolute top-3 right-3",
                        course.status === "completed"
                          ? "bg-green-500 hover:bg-green-600"
                          : course.status === "in_progress"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-500 hover:bg-gray-600",
                      )}
                    >
                      {course.status === "completed"
                        ? "Completado"
                        : course.status === "in_progress"
                          ? "En Progreso"
                          : "Sin Empezar"}
                    </Badge>
                  </div>

                  {/* Información del curso */}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                        <p className="text-sm text-gray-600 mb-2">Por {course.instructor}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{course.description}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Barra de progreso del curso */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progreso</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {course.completedLessons} de {course.totalLessons} lecciones completadas
                        </p>
                      </div>

                      {/* Información adicional del curso */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {course.students}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>

                      {/* Botón para acceder al curso */}
                      <Button className="w-full bg-purple-800 hover:bg-purple-900" asChild>
                        <Link href={`/dashboard/student/course/${course.id}`}>
                          <div className="flex items-center justify-center">
                            <Play className="w-4 h-4 mr-2" />
                            {course.status === "completed"
                              ? "Revisar Curso"
                              : course.status === "not_started"
                                ? "Comenzar Curso"
                                : "Continuar"}
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
