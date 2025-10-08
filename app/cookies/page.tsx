import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Cookie, Settings, Shield, BarChart3, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Cookies | Plataforma Educativa Dental",
  description: "Información sobre el uso de cookies y tecnologías similares en nuestra plataforma educativa.",
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Cookie className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Política de Cookies</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Información sobre cómo utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra
              plataforma
            </p>
            <p className="text-sm text-purple-200 mt-4">Última actualización: 15 de enero de 2025</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Configuración de Cookies */}
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-purple-600" />
                <span>Configuración de Cookies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Cookies Esenciales</h3>
                    <p className="text-sm text-gray-600">Necesarias para el funcionamiento básico de la plataforma</p>
                  </div>
                  <Switch checked disabled />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Cookies de Rendimiento</h3>
                    <p className="text-sm text-gray-600">Nos ayudan a entender cómo interactúas con la plataforma</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Cookies de Funcionalidad</h3>
                    <p className="text-sm text-gray-600">Recuerdan tus preferencias y configuraciones</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Cookies de Marketing</h3>
                    <p className="text-sm text-gray-600">Utilizadas para mostrar contenido relevante</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">Guardar Preferencias</Button>
                  <Button variant="outline">Aceptar Todas</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenido Principal */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>¿Qué son las Cookies?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio
                  web. Nos ayudan a recordar tus preferencias, mejorar tu experiencia y proporcionar funcionalidades
                  personalizadas.
                </p>
                <p className="text-gray-700">
                  También utilizamos tecnologías similares como web beacons, píxeles de seguimiento y almacenamiento
                  local para los mismos propósitos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Cookies que Utilizamos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cookies Esenciales</h3>
                      <p className="text-gray-700 mb-3">
                        Estas cookies son necesarias para que la plataforma funcione correctamente. No se pueden
                        desactivar en nuestros sistemas.
                      </p>
                      <div className="text-sm text-gray-600">
                        <strong>Ejemplos:</strong> Autenticación de sesión, seguridad, preferencias de idioma
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cookies de Rendimiento</h3>
                      <p className="text-gray-700 mb-3">
                        Recopilan información sobre cómo utilizas la plataforma para ayudarnos a mejorar su
                        funcionamiento y rendimiento.
                      </p>
                      <div className="text-sm text-gray-600">
                        <strong>Ejemplos:</strong> Google Analytics, métricas de uso, tiempo de carga
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cookies de Funcionalidad</h3>
                      <p className="text-gray-700 mb-3">
                        Permiten que la plataforma recuerde las opciones que eliges y proporcione características
                        mejoradas y más personales.
                      </p>
                      <div className="text-sm text-gray-600">
                        <strong>Ejemplos:</strong> Progreso de cursos, configuraciones de reproductor, tema preferido
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cookies de Marketing</h3>
                      <p className="text-gray-700 mb-3">
                        Se utilizan para rastrear a los visitantes en los sitios web con la intención de mostrar
                        anuncios relevantes y atractivos.
                      </p>
                      <div className="text-sm text-gray-600">
                        <strong>Ejemplos:</strong> Remarketing, publicidad personalizada, seguimiento de conversiones
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies de Terceros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Algunos de nuestros socios de confianza también colocan cookies en tu dispositivo. Estas cookies de
                  terceros nos ayudan a proporcionar servicios mejorados:
                </p>
                <div className="space-y-3">
                  <div>
                    <strong>Google Analytics:</strong> Para análisis de tráfico y comportamiento de usuarios
                  </div>
                  <div>
                    <strong>Stripe:</strong> Para procesamiento seguro de pagos
                  </div>
                  <div>
                    <strong>Supabase:</strong> Para autenticación y almacenamiento de datos
                  </div>
                  <div>
                    <strong>Vercel:</strong> Para optimización de rendimiento y entrega de contenido
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Duración de las Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Cookies de Sesión</h4>
                    <p className="text-gray-700">
                      Se eliminan automáticamente cuando cierras tu navegador. Se utilizan para funciones esenciales
                      como mantener tu sesión activa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cookies Persistentes</h4>
                    <p className="text-gray-700">
                      Permanecen en tu dispositivo durante un período específico (desde días hasta años) para recordar
                      tus preferencias entre visitas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestión de Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold">En Nuestra Plataforma</h4>
                  <p className="text-gray-700">
                    Puedes gestionar tus preferencias de cookies utilizando el panel de configuración en la parte
                    superior de esta página o a través del banner de cookies.
                  </p>

                  <h4 className="font-semibold">En tu Navegador</h4>
                  <p className="text-gray-700 mb-2">
                    También puedes controlar las cookies directamente desde la configuración de tu navegador:
                  </p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>
                      • <strong>Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies
                    </li>
                    <li>
                      • <strong>Firefox:</strong> Preferencias &gt; Privacidad y seguridad
                    </li>
                    <li>
                      • <strong>Safari:</strong> Preferencias &gt; Privacidad
                    </li>
                    <li>
                      • <strong>Edge:</strong> Configuración &gt; Privacidad, búsqueda y servicios
                    </li>
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Nota:</strong> Desactivar ciertas cookies puede afectar la funcionalidad de la plataforma
                      y tu experiencia de usuario.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actualizaciones de esta Política</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Podemos actualizar esta política de cookies ocasionalmente para reflejar cambios en nuestras prácticas
                  o por razones operativas, legales o regulatorias. Te notificaremos sobre cambios significativos a
                  través de la plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Si tienes preguntas sobre nuestra política de cookies, contáctanos:
                </p>
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>Email:</strong> cookies@plataformadental.com
                  </div>
                  <div>
                    <strong>Dirección:</strong> Av. Universidad 123, Col. Del Valle, CDMX 03100
                  </div>
                  <div>
                    <strong>Teléfono:</strong> +52 (55) 1234-5678
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
