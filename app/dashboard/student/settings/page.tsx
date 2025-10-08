"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Bell, Shield, Save, Trash2, Loader2, Check, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StudentSettings() {
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      whatsapp: true,
      courseReminders: true,
      newCourses: false,
      promotions: false,
    },
    preferences: {
      language: "es",
      timezone: "america/mexico_city",
      videoQuality: "auto",
      autoplay: true,
      subtitles: false,
    },
    privacy: {
      profileVisibility: false,
      progressSharing: true,
      analytics: true,
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente.",
      })

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar la contraseña.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta ha sido eliminada permanentemente.",
      })

      window.location.href = "/"
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la cuenta.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="md:ml-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
            <p className="text-gray-600">Personaliza tu experiencia de aprendizaje</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                    <p className="text-sm text-gray-600">Recibe actualizaciones de cursos por correo</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSetting("notifications", "email", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whatsapp-notifications">Notificaciones por WhatsApp</Label>
                    <p className="text-sm text-gray-600">Recordatorios y avisos importantes</p>
                  </div>
                  <Switch
                    id="whatsapp-notifications"
                    checked={settings.notifications.whatsapp}
                    onCheckedChange={(checked) => updateSetting("notifications", "whatsapp", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="course-reminders">Recordatorios de Curso</Label>
                    <p className="text-sm text-gray-600">Te recordamos continuar tus cursos</p>
                  </div>
                  <Switch
                    id="course-reminders"
                    checked={settings.notifications.courseReminders}
                    onCheckedChange={(checked) => updateSetting("notifications", "courseReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-courses">Nuevos Cursos</Label>
                    <p className="text-sm text-gray-600">Notificaciones sobre cursos nuevos</p>
                  </div>
                  <Switch
                    id="new-courses"
                    checked={settings.notifications.newCourses}
                    onCheckedChange={(checked) => updateSetting("notifications", "newCourses", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotions">Promociones y Ofertas</Label>
                    <p className="text-sm text-gray-600">Descuentos y ofertas especiales</p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={settings.notifications.promotions}
                    onCheckedChange={(checked) => updateSetting("notifications", "promotions", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Preferencias de Aprendizaje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value) => updateSetting("preferences", "language", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select
                    value={settings.preferences.timezone}
                    onValueChange={(value) => updateSetting("preferences", "timezone", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/mexico_city">Ciudad de México (GMT-6)</SelectItem>
                      <SelectItem value="america/new_york">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="america/los_angeles">Los Ángeles (GMT-8)</SelectItem>
                      <SelectItem value="europe/madrid">Madrid (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="video-quality">Calidad de Video Predeterminada</Label>
                  <Select
                    value={settings.preferences.videoQuality}
                    onValueChange={(value) => updateSetting("preferences", "videoQuality", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automática</SelectItem>
                      <SelectItem value="1080p">1080p (HD)</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="480p">480p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoplay">Reproducción Automática</Label>
                    <p className="text-sm text-gray-600">Continúa automáticamente a la siguiente lección</p>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={settings.preferences.autoplay}
                    onCheckedChange={(checked) => updateSetting("preferences", "autoplay", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="subtitles">Subtítulos Automáticos</Label>
                    <p className="text-sm text-gray-600">Mostrar subtítulos por defecto</p>
                  </div>
                  <Switch
                    id="subtitles"
                    checked={settings.preferences.subtitles}
                    onCheckedChange={(checked) => updateSetting("preferences", "subtitles", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacidad y Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility">Perfil Público</Label>
                    <p className="text-sm text-gray-600">Otros estudiantes pueden ver tu perfil</p>
                  </div>
                  <Switch
                    id="profile-visibility"
                    checked={settings.privacy.profileVisibility}
                    onCheckedChange={(checked) => updateSetting("privacy", "profileVisibility", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="progress-sharing">Compartir Progreso</Label>
                    <p className="text-sm text-gray-600">Mostrar tu progreso en certificados</p>
                  </div>
                  <Switch
                    id="progress-sharing"
                    checked={settings.privacy.progressSharing}
                    onCheckedChange={(checked) => updateSetting("privacy", "progressSharing", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Análisis de Aprendizaje</Label>
                    <p className="text-sm text-gray-600">Ayúdanos a mejorar con datos anónimos</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) => updateSetting("privacy", "analytics", checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full bg-transparent">
                        Cambiar Contraseña
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cambiar Contraseña</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">Contraseña Actual</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPassword ? "text" : "password"}
                              value={passwordForm.currentPassword}
                              onChange={(e) =>
                                setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                              }
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="new-password">Nueva Contraseña</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          />
                        </div>
                        <Button
                          onClick={handlePasswordChange}
                          disabled={isLoading}
                          className="w-full bg-purple-800 hover:bg-purple-900"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          Cambiar Contraseña
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Descargar Mis Datos
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Gestión de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Suscripción Actual</h3>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Plan Premium</p>
                    <p className="text-xs text-purple-700">Renovación: 15 de Marzo, 2024</p>
                  </div>
                  <Button variant="outline" className="w-full mt-2 bg-transparent">
                    Gestionar Suscripción
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Métodos de Pago</h3>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-900">•••• •••• •••• 4242</p>
                    <p className="text-xs text-gray-600">Visa - Expira 12/26</p>
                  </div>
                  <Button variant="outline" className="w-full mt-2 bg-transparent">
                    Actualizar Método de Pago
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-red-600 mb-2">Zona de Peligro</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
                  </p>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Cuenta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos
                          asociados, incluyendo progreso de cursos y certificados.
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">
                            Cancelar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-2" />
                            )}
                            Eliminar Cuenta
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isLoading} className="bg-purple-800 hover:bg-purple-900">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isLoading ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
