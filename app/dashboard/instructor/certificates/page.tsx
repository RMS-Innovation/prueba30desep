"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Search, Download, Eye, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface Certificate {
  id: number
  studentName: string
  studentEmail: string
  studentAvatar: string | null
  courseTitle: string
  issueDate: string
  certificateId: string
  grade: string
  status: "issued" | "pending" | "revoked"
}

export default function InstructorCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const mockCertificates: Certificate[] = [
    {
      id: 1,
      studentName: "Ana María Rodríguez",
      studentEmail: "ana.rodriguez@email.com",
      studentAvatar: null,
      courseTitle: "Anatomía Dental Avanzada",
      issueDate: "2024-01-15",
      certificateId: "ADA-2024-001",
      grade: "Excelente",
      status: "issued",
    },
    {
      id: 2,
      studentName: "Carlos Méndez",
      studentEmail: "carlos.mendez@email.com",
      studentAvatar: null,
      courseTitle: "Técnicas de Endodoncia",
      issueDate: "2024-01-14",
      certificateId: "TE-2024-002",
      grade: "Muy Bueno",
      status: "issued",
    },
    {
      id: 3,
      studentName: "Laura Sánchez",
      studentEmail: "laura.sanchez@email.com",
      studentAvatar: null,
      courseTitle: "Prostodoncia Digital",
      issueDate: "2024-01-13",
      certificateId: "PD-2024-003",
      grade: "Excelente",
      status: "issued",
    },
    {
      id: 4,
      studentName: "Miguel Torres",
      studentEmail: "miguel.torres@email.com",
      studentAvatar: null,
      courseTitle: "Anatomía Dental Avanzada",
      issueDate: "",
      certificateId: "",
      grade: "",
      status: "pending",
    },
  ]

  useEffect(() => {
    const loadCertificates = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCertificates(mockCertificates)
      } catch (error) {
        console.error("Error loading certificates:", error)
        setCertificates(mockCertificates)
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: certificates.filter((c) => c.status === "issued").length,
    pending: certificates.filter((c) => c.status === "pending").length,
    thisMonth: certificates.filter((c) => {
      if (!c.issueDate) return false
      const issueDate = new Date(c.issueDate)
      const now = new Date()
      return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear()
    }).length,
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificados</h1>
            <p className="text-gray-600">Gestiona los certificados emitidos a tus estudiantes</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Emitidos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Este Mes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.thisMonth}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-800" />
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
                placeholder="Buscar certificados..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Certificates Table */}
          <Card>
            <CardHeader>
              <CardTitle>Certificados Emitidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={cert.studentAvatar || undefined} />
                        <AvatarFallback className="bg-purple-100 text-purple-800">
                          {cert.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{cert.studentName}</h3>
                        <p className="text-sm text-gray-600">{cert.courseTitle}</p>
                        {cert.status === "issued" && (
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>ID: {cert.certificateId}</span>
                            <span>Emitido: {new Date(cert.issueDate).toLocaleDateString("es-ES")}</span>
                            <span>Calificación: {cert.grade}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={cert.status === "issued" ? "default" : "secondary"}
                        className={
                          cert.status === "issued"
                            ? "bg-green-500 hover:bg-green-600"
                            : cert.status === "pending"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-red-500 hover:bg-red-600"
                        }
                      >
                        {cert.status === "issued" ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Emitido
                          </>
                        ) : cert.status === "pending" ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Pendiente
                          </>
                        ) : (
                          "Revocado"
                        )}
                      </Badge>

                      {cert.status === "issued" ? (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Descargar
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" className="bg-purple-800 hover:bg-purple-900">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Emitir Certificado
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredCertificates.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron certificados</h3>
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
