"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, Star, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Course {
  id: string
  title: string
  description: string
  instructor_name: string
  price: number
  duration_hours: number
  level: "beginner" | "intermediate" | "advanced"
  category: string
  thumbnail_url?: string
  rating: number
  student_count: number
  created_at: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        title: "Endodoncia Avanzada: Técnicas Modernas",
        description: "Aprende las técnicas más avanzadas en endodoncia con casos clínicos reales y práctica guiada.",
        instructor_name: "Dr. María González",
        price: 299.99,
        duration_hours: 12,
        level: "advanced",
        category: "Endodoncia",
        thumbnail_url: "/placeholder-d1ufm.png",
        rating: 4.8,
        student_count: 245,
        created_at: "2024-01-15",
      },
      {
        id: "2",
        title: "Ortodoncia Digital: Del Diagnóstico al Tratamiento",
        description: "Domina las herramientas digitales en ortodoncia moderna y optimiza tus tratamientos.",
        instructor_name: "Dr. Carlos Ruiz",
        price: 399.99,
        duration_hours: 16,
        level: "intermediate",
        category: "Ortodoncia",
        thumbnail_url: "/digital-dental-orthodontics.png",
        rating: 4.9,
        student_count: 189,
        created_at: "2024-02-01",
      },
      {
        id: "3",
        title: "Implantología Básica: Fundamentos Esenciales",
        description: "Curso introductorio a la implantología dental con técnicas básicas y casos prácticos.",
        instructor_name: "Dr. Ana Martínez",
        price: 199.99,
        duration_hours: 8,
        level: "beginner",
        category: "Implantología",
        thumbnail_url: "/dental-implants-course.png",
        rating: 4.7,
        student_count: 312,
        created_at: "2024-01-20",
      },
      {
        id: "4",
        title: "Periodoncia Clínica: Diagnóstico y Tratamiento",
        description: "Manejo integral de enfermedades periodontales con enfoque clínico actualizado.",
        instructor_name: "Dr. Luis Fernández",
        price: 249.99,
        duration_hours: 10,
        level: "intermediate",
        category: "Periodoncia",
        thumbnail_url: "/periodoncia-dental-treatment.png",
        rating: 4.6,
        student_count: 156,
        created_at: "2024-02-10",
      },
    ]

    setTimeout(() => {
      setCourses(mockCourses)
      setFilteredCourses(mockCourses)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and search logic
  useEffect(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.student_count - a.student_count
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Catálogo de Cursos</h1>
          <p className="text-lg text-gray-600">Descubre cursos especializados en odontología impartidos por expertos</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Endodoncia">Endodoncia</SelectItem>
                <SelectItem value="Ortodoncia">Ortodoncia</SelectItem>
                <SelectItem value="Implantología">Implantología</SelectItem>
                <SelectItem value="Periodoncia">Periodoncia</SelectItem>
                <SelectItem value="Cirugía Oral">Cirugía Oral</SelectItem>
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="beginner">Principiante</SelectItem>
                <SelectItem value="intermediate">Intermedio</SelectItem>
                <SelectItem value="advanced">Avanzado</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularidad</SelectItem>
                <SelectItem value="rating">Calificación</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="newest">Más Recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredCourses.length} de {courses.length} cursos
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <Image
                  src={course.thumbnail_url || "/placeholder.svg?height=200&width=300&query=dental+course"}
                  alt={course.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${getLevelColor(course.level)}`}>
                  {getLevelText(course.level)}
                </Badge>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {course.rating}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration_hours}h
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.student_count} estudiantes
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">Por {course.instructor_name}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">${course.price}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Ver Curso</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cursos</h3>
            <p className="text-gray-600">Intenta ajustar los filtros o términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
