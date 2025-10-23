"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, TrendingUp, Clock, Award, Mail, Eye } from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  avatar: string | null
  enrolledCourses: number
  completedCourses: number
  averageProgress: number
  lastActive: string
  totalStudyTime: number
}

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const mockStudents: Student[] = [
    {
      id: 1,
      name: "Ana María Rodríguez",
      email: "ana.rodriguez@email.com",
      avatar: null,
      enrolledCourses: 3,
      completedCourses: 1,
      averageProgress: 75,
      lastActive: "2024-01-15",
      totalStudyTime: 12,
    },
    {
      id: 2,
      name: "Carlos Méndez",
      email: "carlos.mendez@email.com",
      avatar: null,
      enrolledCourses: 2,
      completedCourses: 2,
      averageProgress: 100,
      lastActive: "2024-01-14",
      totalStudyTime: 18,
    },
    {
      id: 3,
      name: "Laura Sánchez",
      email: "laura.sanchez@email.com",
      avatar: null,
      enrolledCourses: 4,
      completedCourses: 1,
      averageProgress: 45,
      lastActive: "2024-01-13",
      totalStudyTime: 8,
    },
    {
      id: 4,
      name: "Miguel Torres",
      email: "miguel.torres@email.com",
      avatar: null,
      enrolledCourses: 2,
      completedCourses: 0,
      averageProgress: 30,
      lastActive: "2024-01-12",
      totalStudyTime: 5,
    },
  ]

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStudents(mockStudents)
      } catch (error) {
        console.error("Error loading students:", error)
        setStudents(mockStudents)
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: students.length,
    active: students.filter((s) => {
      const lastActive = new Date(s.lastActive)
      const daysSince = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
      return daysSince <= 7
    }).length,
    avgProgress: Math.round(students.reduce((sum, s) => sum + s.averageProgress, 0) / students.length),
    totalStudyTime: students.reduce((sum, s) => sum + s.totalStudyTime, 0),
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Estudiantes</h1>
            <p className="text-gray-600">Monitorea el progreso y desempeño de tus estudiantes</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-800" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Activos (7 días)</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgProgress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Horas de Estudio</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudyTime}h</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
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
                placeholder="Buscar estudiantes..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar || undefined} />
                        <AvatarFallback className="bg-purple-100 text-purple-800">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {student.email}
                          </span>
                          <span>{student.enrolledCourses} cursos inscritos</span>
                          <span>{student.completedCourses} completados</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{student.averageProgress}%</p>
                        <p className="text-xs text-gray-600">Progreso</p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{student.totalStudyTime}h</p>
                        <p className="text-xs text-gray-600">Estudio</p>
                      </div>

                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(student.lastActive).toLocaleDateString("es-ES")}
                      </Badge>

                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron estudiantes</h3>
                  <p className="text-gray-600">Intenta ajustar tu búsqueda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
