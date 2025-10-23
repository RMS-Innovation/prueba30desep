"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoUpload } from "@/components/video/video-upload"
import { VideoList } from "@/components/video/video-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Upload, List } from "lucide-react"

export default function InstructorVideosPage() {
  const [selectedCourseId, setSelectedCourseId] = useState("1")
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="instructor" />

      <div className="md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Videos</h1>
            <p className="text-gray-600">Sube y administra los videos de tus cursos</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Videos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">48</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-800" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Horas de Contenido</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">36h</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vistas Totales</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center">
                <List className="w-4 h-4 mr-2" />
                Mis Videos
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Subir Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Videos del Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoList courseId={selectedCourseId} canEdit={true} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <VideoUpload
                courseId={selectedCourseId}
                onUploadComplete={(video) => {
                  console.log("Video uploaded:", video)
                  setActiveTab("list")
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
