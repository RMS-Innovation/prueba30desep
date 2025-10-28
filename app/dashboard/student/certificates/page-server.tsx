import { getSimpleSession } from "@/lib/simple-auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Eye, Calendar, CheckCircle } from "lucide-react"
import { StudentAvatar } from "@/components/ui/student-avatar"

interface Certificate {
  id: number
  courseTitle: string
  issueDate: string
  certificateId: string
  instructor: string
  grade: string
  status: string
  thumbnail: string
}

interface CourseInProgress {
  id: number
  courseTitle: string
  progress: number
  estimatedCompletion: string
  instructor: string
}

export default async function StudentCertificates() {
  const session = await getSimpleSession()

  if (!session?.user || session.user.role !== "student") {
    redirect("/auth/login")
  }

  let certificates: Certificate[] = []
  let inProgress: CourseInProgress[] = []

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/student/certificates`,
      {
        headers: {
          Cookie: `simple-session=${session.user.id}`,
        },
      },
    )

    if (response.ok) {
      const data = await response.json()
      certificates = data.certificates || []
      inProgress = data.inProgress || []
    }
  } catch (error) {
    console.log("API not available, using mock data")
  }

  if (certificates.length === 0) {
    certificates = [
      {
        id: 1,
        courseTitle: "Prostodoncia Digital",
        issueDate: "2024-01-15",
        certificateId: "PD-2024-001247",
        instructor: "Dr. Ana López",
        grade: "Excelente",
        status: "completed",
        thumbnail: "/certificate-prosthodontics.png",
      },
      {
        id: 2,
        courseTitle: "Técnicas de Endodoncia Básica",
        issueDate: "2023-12-08",
        certificateId: "TE-2023-000892",
        instructor: "Dr. Carlos Ruiz",
        grade: "Muy Bueno",
        status: "completed",
        thumbnail: "/certificate-endodontics.png",
      },
    ]
  }

  if (inProgress.length === 0) {
    inProgress = [
      {
        id: 3,
        courseTitle: "Anatomía Dental Avanzada",
        progress: 72,
        estimatedCompletion: "2024-02-20",
        instructor: "Dr. María González",
      },
    ]
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
                <h1 className="text-3xl font-bold text-gray-900">Mis Certificados</h1>
                <p className="text-gray-600">Gestiona y descarga tus certificados digitales verificados</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
                    <p className="text-sm text-gray-600">Certificados Obtenidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{inProgress.length}</p>
                    <p className="text-sm text-gray-600">En Progreso</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-sm text-gray-600">Horas Certificadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completed Certificates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Certificados Completados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert: Certificate) => (
                  <div key={cert.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{cert.courseTitle}</h3>
                        <p className="text-sm text-gray-600 mb-2">Por {cert.instructor}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>ID: {cert.certificateId}</span>
                          <span>Fecha: {new Date(cert.issueDate).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        {cert.grade}
                      </Badge>
                    </div>

                    <div className="w-full h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                      <Award className="w-12 h-12 text-purple-600" />
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-purple-800 hover:bg-purple-900">
                        <Download className="w-4 h-4 mr-1" />
                        Descargar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Certificados en Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inProgress.map((course: CourseInProgress) => (
                  <div key={course.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.courseTitle}</h3>
                        <p className="text-sm text-gray-600">Por {course.instructor}</p>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        {course.progress}% Completado
                      </Badge>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        Finalización estimada: {new Date(course.estimatedCompletion).toLocaleDateString("es-ES")}
                      </span>
                      <Button size="sm" variant="outline">
                        Continuar Curso
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
