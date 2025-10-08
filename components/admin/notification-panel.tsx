"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Users } from "lucide-react"

export function NotificationPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    recipient: "",
    type: "",
    message: "",
  })

  const handleSendNotification = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.recipient,
          type: formData.type,
          data: { customMessage: formData.message },
        }),
      })

      if (response.ok) {
        setFormData({ recipient: "", type: "", message: "" })
        // Show success message
      }
    } catch (error) {
      console.error("Error sending notification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Enviar Notificación WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Destinatario</Label>
          <Input
            id="recipient"
            placeholder="ID del usuario o 'all' para todos"
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Notificación</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enrollment">Inscripción</SelectItem>
              <SelectItem value="completion">Completación</SelectItem>
              <SelectItem value="certificate">Certificado</SelectItem>
              <SelectItem value="payment">Pago</SelectItem>
              <SelectItem value="reminder">Recordatorio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensaje Personalizado (Opcional)</Label>
          <Textarea
            id="message"
            placeholder="Mensaje adicional..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={3}
          />
        </div>

        <Button
          onClick={handleSendNotification}
          disabled={isLoading || !formData.recipient || !formData.type}
          className="w-full bg-purple-800 hover:bg-purple-900"
        >
          <Send className="w-4 h-4 mr-2" />
          {isLoading ? "Enviando..." : "Enviar Notificación"}
        </Button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-900">Notificaciones Automáticas</h3>
          </div>
          <p className="text-sm text-blue-800">
            Las notificaciones se envían automáticamente cuando los usuarios se inscriben, completan cursos, reciben
            certificados o realizan pagos.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
