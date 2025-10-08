"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, Bell } from "lucide-react"

interface NotificationPreferences {
  email: boolean
  whatsapp: boolean
  push: boolean
}

interface NotificationSettingsProps {
  initialPreferences: NotificationPreferences
  phone?: string
}

export function NotificationSettings({ initialPreferences, phone }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [phoneNumber, setPhoneNumber] = useState(phone || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences,
          phone: phoneNumber,
        }),
      })

      if (response.ok) {
        // Show success message
        console.log("Preferences updated successfully")
      }
    } catch (error) {
      console.error("Error updating preferences:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Configuración de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">Número de WhatsApp</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+52 55 1234 5678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-sm text-gray-600">Incluye el código de país para recibir notificaciones por WhatsApp</p>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Canales de Notificación</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">Recibir notificaciones por correo electrónico</p>
              </div>
            </div>
            <Switch
              checked={preferences.email}
              onCheckedChange={(checked) => setPreferences({ ...preferences, email: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-gray-600">Recibir notificaciones por WhatsApp</p>
              </div>
            </div>
            <Switch
              checked={preferences.whatsapp}
              onCheckedChange={(checked) => setPreferences({ ...preferences, whatsapp: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">Notificaciones Push</p>
                <p className="text-sm text-gray-600">Recibir notificaciones en el navegador</p>
              </div>
            </div>
            <Switch
              checked={preferences.push}
              onCheckedChange={(checked) => setPreferences({ ...preferences, push: checked })}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full bg-purple-800 hover:bg-purple-900">
          {isLoading ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </CardContent>
    </Card>
  )
}
