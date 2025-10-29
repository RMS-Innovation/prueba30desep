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
import { User, Camera, Save, Upload, Award, BookOpen } from "lucide-react"

export default function InstructorProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg")
  const [personalData, setPersonalData] = useState({
    firstName: "Dr. María",
    lastName: "González",
    email: "maria.gonzalez@dentaledu.com",
    phone: "",
    bio: "",
  })
  const [professionalData, setProfessionalData] = useState({
    title: "",
    specialization: "",
    experience: "",
    education: "",
    certifications: "",
    workplace: "",
    location: "",
  })
  const [teachingData, setTeachingData] = useState({
    teachingExperience: "",
    expertise: "",
    languages: "",
    website: "",
    linkedin: "",
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

  const handleSaveTeachingInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "¡Información de enseñanza actualizada!",
        description: "Tus datos de enseñanza se han guardado correctamente",
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
      <Sidebar userRole="instructor" />

      <div className="md:ml-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil de Instructor</h1>
            <p className="text-gray-600">
              Actualiza tu información profesional y de enseñanza para que los estudiantes te conozcan mejor
            </p>
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

                <div className="w-full mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cursos Creados</span>
                      <span className="text-sm font-semibold text-gray-900">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estudiantes</span>
                      <span className="text-sm font-semibold text-gray-900">1,234</span>
                    </div>
                    
                  </div>
                </div>
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
                      <Label htmlFor="bio">Biografía Profesional *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Cuéntales a tus estudiantes sobre tu experiencia, logros y pasión por la enseñanza..."
                        rows={4}
                        value={personalData.bio}
                        onChange={(e) => setPersonalData({ ...personalData, bio: e.target.value })}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Esta biografía será visible para todos los estudiantes
                      </p>
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
                <Award className="w-5 h-5 mr-2" />
                Información Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfessionalInfo} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título Profesional *</Label>
                    <Select
                      value={professionalData.title}
                      onValueChange={(value) => setProfessionalData({ ...professionalData, title: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu título" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr">Dr./Dra.</SelectItem>
                        <SelectItem value="dds">DDS</SelectItem>
                        <SelectItem value="dmd">DMD</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="specialist">Especialista</SelectItem>
                        <SelectItem value="professor">Profesor/a</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="specialization">Especialización *</Label>
                    <Select
                      value={professionalData.specialization}
                      onValueChange={(value) => setProfessionalData({ ...professionalData, specialization: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu especialización" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Odontología General</SelectItem>
                        <SelectItem value="orthodontics">Ortodoncia</SelectItem>
                        <SelectItem value="endodontics">Endodoncia</SelectItem>
                        <SelectItem value="periodontics">Periodoncia</SelectItem>
                        <SelectItem value="prosthodontics">Prostodoncia</SelectItem>
                        <SelectItem value="oral-surgery">Cirugía Oral</SelectItem>
                        <SelectItem value="pediatric">Odontopediatría</SelectItem>
                        <SelectItem value="implantology">Implantología</SelectItem>
                        <SelectItem value="cosmetic">Odontología Estética</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">Años de Experiencia Profesional *</Label>
                  <Select
                    value={professionalData.experience}
                    onValueChange={(value) => setProfessionalData({ ...professionalData, experience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu experiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-5">2-5 años</SelectItem>
                      <SelectItem value="6-10">6-10 años</SelectItem>
                      <SelectItem value="11-15">11-15 años</SelectItem>
                      <SelectItem value="16-20">16-20 años</SelectItem>
                      <SelectItem value="21+">21+ años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="education">Educación y Títulos</Label>
                  <Textarea
                    id="education"
                    placeholder="Universidad, títulos obtenidos, año de graduación..."
                    rows={3}
                    value={professionalData.education}
                    onChange={(e) => setProfessionalData({ ...professionalData, education: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certificaciones y Reconocimientos</Label>
                  <Textarea
                    id="certifications"
                    placeholder="Certificaciones profesionales, premios, reconocimientos..."
                    rows={3}
                    value={professionalData.certifications}
                    onChange={(e) => setProfessionalData({ ...professionalData, certifications: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workplace">Lugar de Trabajo Actual</Label>
                    <Input
                      id="workplace"
                      placeholder="Clínica, Hospital, Universidad..."
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Información de Enseñanza
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveTeachingInfo} className="space-y-6">
                <div>
                  <Label htmlFor="teachingExperience">Experiencia en Enseñanza</Label>
                  <Select
                    value={teachingData.teachingExperience}
                    onValueChange={(value) => setTeachingData({ ...teachingData, teachingExperience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu experiencia en enseñanza" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 años</SelectItem>
                      <SelectItem value="3-5">3-5 años</SelectItem>
                      <SelectItem value="6-10">6-10 años</SelectItem>
                      <SelectItem value="11+">11+ años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="expertise">Áreas de Experiencia para Enseñar</Label>
                  <Textarea
                    id="expertise"
                    placeholder="Técnicas quirúrgicas, diagnóstico por imagen, tratamientos estéticos..."
                    rows={3}
                    value={teachingData.expertise}
                    onChange={(e) => setTeachingData({ ...teachingData, expertise: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="languages">Idiomas que Hablas</Label>
                  <Input
                    id="languages"
                    placeholder="Español, Inglés, Francés..."
                    value={teachingData.languages}
                    onChange={(e) => setTeachingData({ ...teachingData, languages: e.target.value })}
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
                      Actualizar Información de Enseñanza
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
