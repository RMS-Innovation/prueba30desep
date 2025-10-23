"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Plus, Search, Users, Video, Edit, Trash2, Eye, TrendingUp, Clock } from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  status: "draft" | "published" | "archived"
  students: number
  videos: number
  completionRate: number
  revenue: number
  lastUpdated: string
  thumbnail: string
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const mockCourses: Course[] = [
    {
      id: 1,
      title: "Anatomía Dental Avanzada",
      description: "Curso completo sobre anatomía dental con casos clínicos reales",
      status: "published",
      students: 28,
      videos: 12,
      completionRate: 85,
      revenue: 2800,
      lastUpdated: "2024-01-15",
      thumbnail: "/dental-anatomy-course.png",
    },
    {
      id: 2,
      title: "Técnicas de Endodoncia",
      description: "Aprende las técnicas más avanzadas en endodoncia moderna",
      status: "published",
      students: 35,
      videos: 15,
      completionRate: 72,
      revenue: 3500,
      lastUpdated: "2024-01-12",
      thumbnail: "/endodontics-course.png",
    },
    {
      id: 3,
      title: "Prostodoncia Digital",
      description: "Domina las herramientas digitales en prostodoncia",
      status: "published",
      students: 22,
      videos: 10,
      completionRate: 95,
      revenue: 2200,
      lastUpdated: "2024-01-10",
      thumbnail: "/digital-prosthodontics.png",
    },
    {
      id: 4,
      title: "Ortodoncia Moderna",
      description: "Técnicas actuales en ortodoncia y aparatología",
      status: "draft",
      students: 0,
      videos: 5,
      completionRate: 0,
      revenue: 0,
      lastUpdated: "2024-01-08",
      thumbnail: "/orthodontics-course.png",
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

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.status === "published").length,
    draft: courses.filter((c) => c.status === "draft").length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar userRole="instructor" />
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
      <Sidebar userRole="instructor" />

      <div className="md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h1>
              <p className="text-gray-600">Gestiona y crea tus cursos educativos</p>
            </div>
            <Button className="bg-purple-800 hover:bg-purple-900">
              <Plus className="w-4 h-4 mr-2" />
              Crear Curso
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-800" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Publicados</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.published}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Borradores</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.draft}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Edit className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar cursos..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      course.status === "published"
                        ? "bg-green-500 hover:bg-green-600"
                        : course.status === "draft"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    {course.status === "published" ? "Publicado" : course.status === "draft" ? "Borrador" : "Archivado"}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Video className="w-4 h-4 mr-1" />
                        {course.videos}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {course.completionRate}%
                      </div>
                    </div>

                    {/* Revenue */}
                    {course.revenue > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600">Ingresos: </span>
                        <span className="font-semibold text-green-600">${course.revenue.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Last Updated */}
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Actualizado {new Date(course.lastUpdated).toLocaleDateString("es-ES")}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cursos</h3>
              <p className="text-gray-600 mb-4">Intenta ajustar tu búsqueda o crea un nuevo curso</p>
              <Button className="bg-purple-800 hover:bg-purple-900">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Curso
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
