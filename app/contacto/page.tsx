import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Contacto | Plataforma Educativa Dental",
  description: "Ponte en contacto con nosotros. Estamos aquí para ayudarte con cualquier pregunta o consulta.",
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contáctanos</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Estamos aquí para ayudarte. Ponte en contacto con nosotros y te responderemos lo antes posible
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Información de Contacto */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Información de Contacto</h2>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-gray-600">info@plataformadental.com</p>
                    <p className="text-gray-600">soporte@plataformadental.com</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Teléfono</h3>
                    <p className="text-gray-600">+52 (55) 1234-5678</p>
                    <p className="text-gray-600">+52 (55) 8765-4321</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Dirección</h3>
                    <p className="text-gray-600">
                      Av. Universidad 123
                      <br />
                      Col. Del Valle
                      <br />
                      Ciudad de México, CDMX 03100
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Horarios de Atención</h3>
                    <p className="text-gray-600">
                      Lunes a Viernes: 9:00 AM - 6:00 PM
                      <br />
                      Sábados: 10:00 AM - 2:00 PM
                      <br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
                <CardDescription>Completa el formulario y nos pondremos en contacto contigo pronto</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input id="nombre" placeholder="Tu nombre completo" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="tu@email.com" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" placeholder="+52 (55) 1234-5678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de Consulta *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soporte">Soporte Técnico</SelectItem>
                          <SelectItem value="cursos">Información sobre Cursos</SelectItem>
                          <SelectItem value="pagos">Problemas de Pago</SelectItem>
                          <SelectItem value="certificados">Certificaciones</SelectItem>
                          <SelectItem value="instructor">Ser Instructor</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Input id="asunto" placeholder="Breve descripción del tema" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Describe tu consulta o problema en detalle..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="privacidad" className="rounded" required />
                    <Label htmlFor="privacidad" className="text-sm text-gray-600">
                      Acepto la{" "}
                      <a href="/privacidad" className="text-purple-600 hover:underline">
                        política de privacidad
                      </a>{" "}
                      y el tratamiento de mis datos personales
                    </Label>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                    <Send className="h-5 w-5 mr-2" />
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mapa o Información Adicional */}
        <section className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">¿Prefieres una Respuesta Inmediata?</h2>
              <p className="text-gray-600 mb-6">Consulta nuestro centro de ayuda o inicia un chat en vivo</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline">
                  Centro de Ayuda
                </Button>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Chat en Vivo
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
