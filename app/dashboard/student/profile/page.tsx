"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { User, MapPin, Camera, Save, Upload } from "lucide-react"

export default function StudentProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg")
  const [personalData, setPersonalData] = useState({
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "",
    birthDate: "",
    bio: "",
  })
  const [professionalData, setProfessionalData] = useState({
    profession: "",
    experience: "",
    workplace: "",
    location: "",
    specialties: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 5MB",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "¡Éxito!",
        description: "Foto de perfil actualizada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir la imagen. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "¡Información actualizada!",
        description: "Tus datos personales se han guardado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la información. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfessionalInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "¡Información profesional actualizada!",
        description: "Tus datos profesionales se han guardado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la información. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="md:ml-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Actualiza tu información personal y preferencias de aprendizaje</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Foto de Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={profileImage || "/placeholder.svg"} alt="Foto de perfil" />
                    <AvatarFallback className="text-2xl bg-purple-100 text-purple-800">
                      {personalData.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-pulse" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Cambiar Foto
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 mt-2 text-center">JPG, PNG o GIF. Máximo 5MB.</p>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePersonalInfo} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre *</Label>
                        <Input
                          id="firstName"
                          value={personalData.firstName}
                          onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido *</Label>
                        <Input
                          id="lastName"
                          value={personalData.lastName}
                          onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Correo Electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalData.email}
                        onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+52 123 456 7890"
                          value={personalData.phone}
                          onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={personalData.birthDate}
                          onChange={(e) => setPersonalData({ ...personalData, birthDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        placeholder="Cuéntanos un poco sobre ti y tus objetivos profesionales..."
                        rows={4}
                        value={personalData.bio}
                        onChange={(e) => setPersonalData({ ...personalData, bio: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-purple-800 hover:bg-purple-900" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Información Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfessionalInfo} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profession">Profesión</Label>
                    <Select
                      value={professionalData.profession}
                      onValueChange={(value) => setProfessionalData({ ...professionalData, profession: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu profesión" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dentist">Dentista</SelectItem>
                        <SelectItem value="dental-hygienist">Higienista Dental</SelectItem>
                        <SelectItem value="dental-assistant">Asistente Dental</SelectItem>
                        <SelectItem value="dental-technician">Técnico Dental</SelectItem>
                        <SelectItem value="student">Estudiante de Odontología</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Años de Experiencia</Label>
                    <Select
                      value={professionalData.experience}
                      onValueChange={(value) => setProfessionalData({ ...professionalData, experience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu experiencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 años</SelectItem>
                        <SelectItem value="2-5">2-5 años</SelectItem>
                        <SelectItem value="6-10">6-10 años</SelectItem>
                        <SelectItem value="11-15">11-15 años</SelectItem>
                        <SelectItem value="16+">16+ años</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workplace">Lugar de Trabajo</Label>
                    <Input
                      id="workplace"
                      placeholder="Clínica, Hospital, Consultorio..."
                      value={professionalData.workplace}
                      onChange={(e) => setProfessionalData({ ...professionalData, workplace: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      placeholder="Ciudad, Estado, País"
                      value={professionalData.location}
                      onChange={(e) => setProfessionalData({ ...professionalData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialties">Especialidades de Interés</Label>
                  <Textarea
                    id="specialties"
                    placeholder="Endodoncia, Ortodoncia, Implantología, Periodoncia..."
                    rows={3}
                    value={professionalData.specialties}
                    onChange={(e) => setProfessionalData({ ...professionalData, specialties: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-purple-800 hover:bg-purple-900" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Actualizar Información Profesional
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
