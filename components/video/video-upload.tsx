"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Upload, Video, X, CheckCircle } from "lucide-react"

interface VideoUploadProps {
  courseId: string
  onUploadComplete?: (video: any) => void
}

export function VideoUpload({ courseId, onUploadComplete }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [orderIndex, setOrderIndex] = useState(1)
  const [isPreview, setIsPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/avi"]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Tipo de archivo no válido. Solo se permiten MP4, WebM, MOV y AVI.")
        return
      }

      // Validate file size (500MB max)
      const maxSize = 500 * 1024 * 1024
      if (selectedFile.size > maxSize) {
        setError("El archivo es demasiado grande. Máximo 500MB.")
        return
      }

      setFile(selectedFile)
      setError("")

      // Auto-generate title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "")
        setTitle(fileName)
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError("Por favor selecciona un archivo y proporciona un título.")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError("")

    try {
      const formData = new FormData()
      formData.append("video", file)
      formData.append("courseId", courseId)
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      formData.append("orderIndex", orderIndex.toString())
      formData.append("isPreview", isPreview.toString())

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const result = await response.json()
        setSuccess(true)
        onUploadComplete?.(result.video)

        // Reset form
        setTimeout(() => {
          setFile(null)
          setTitle("")
          setDescription("")
          setOrderIndex(orderIndex + 1)
          setIsPreview(false)
          setSuccess(false)
          setUploadProgress(0)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        }, 2000)
      } else {
        const error = await response.json()
        setError(error.message || "Error al subir el video")
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">¡Video subido exitosamente!</h3>
            <p className="text-muted-foreground">El video se está procesando y estará disponible pronto.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Video</CardTitle>
        <CardDescription>
          Sube un nuevo video para este curso. Formatos soportados: MP4, WebM, MOV, AVI (máximo 500MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* File Upload Area */}
        <div className="space-y-4">
          <Label>Archivo de Video</Label>
          {!file ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">Haz clic para seleccionar un video</p>
              <p className="text-sm text-gray-500 mt-2">o arrastra y suelta aquí</p>
              <p className="text-xs text-gray-400 mt-2">MP4, WebM, MOV, AVI - Máximo 500MB</p>
            </div>
          ) : (
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Video className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile} disabled={uploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
        </div>

        {/* Video Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Video *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Introducción a la Endodoncia"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el contenido del video..."
              rows={3}
              disabled={uploading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderIndex">Orden en el Curso</Label>
              <Input
                id="orderIndex"
                type="number"
                min="1"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number.parseInt(e.target.value) || 1)}
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label>Vista Previa Gratuita</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch checked={isPreview} onCheckedChange={setIsPreview} disabled={uploading} />
                <span className="text-sm text-gray-600">
                  {isPreview ? "Visible para todos" : "Solo para estudiantes inscritos"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subiendo video...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Upload Button */}
        <Button onClick={handleUpload} disabled={!file || !title.trim() || uploading} className="w-full">
          {uploading ? "Subiendo..." : "Subir Video"}
        </Button>
      </CardContent>
    </Card>
  )
}
