import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, UserCheck, Database, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Privacidad | Plataforma Educativa Dental",
  description: "Conoce cómo protegemos y manejamos tu información personal en nuestra plataforma educativa.",
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Política de Privacidad</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Tu privacidad es importante para nosotros. Conoce cómo protegemos y manejamos tu información personal
            </p>
            <p className="text-sm text-purple-200 mt-4">Última actualización: 15 de enero de 2025</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Resumen */}
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-6 w-6 text-purple-600" />
                <span>Resumen de Privacidad</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Datos Seguros</h3>
                  <p className="text-sm text-gray-600">Encriptamos toda tu información personal</p>
                </div>
                <div className="text-center">
                  <UserCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Control Total</h3>
                  <p className="text-sm text-gray-600">Tú decides qué información compartir</p>
                </div>
                <div className="text-center">
                  <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Sin Venta</h3>
                  <p className="text-sm text-gray-600">Nunca vendemos tus datos a terceros</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenido Principal */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Información que Recopilamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Información Personal</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Nombre completo y dirección de correo electrónico</li>
                    <li>Información de perfil profesional (especialidad, experiencia)</li>
                    <li>Fotografía de perfil (opcional)</li>
                    <li>Número de teléfono (opcional)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Información de Uso</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Progreso en cursos y tiempo de estudio</li>
                    <li>Interacciones con el contenido educativo</li>
                    <li>Preferencias de aprendizaje y configuraciones</li>
                    <li>Historial de navegación en la plataforma</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Información Técnica</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Dirección IP y ubicación geográfica aproximada</li>
                    <li>Tipo de dispositivo y navegador utilizado</li>
                    <li>Cookies y tecnologías similares</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Cómo Utilizamos tu Información</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>
                      <strong>Prestación del Servicio:</strong> Para proporcionarte acceso a cursos, seguimiento de
                      progreso y certificaciones
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>
                      <strong>Comunicación:</strong> Para enviarte actualizaciones sobre cursos, notificaciones
                      importantes y soporte técnico
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>
                      <strong>Mejora del Servicio:</strong> Para analizar el uso de la plataforma y mejorar la
                      experiencia educativa
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>
                      <strong>Seguridad:</strong> Para proteger la plataforma contra fraudes y actividades maliciosas
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>
                      <strong>Cumplimiento Legal:</strong> Para cumplir con obligaciones legales y regulatorias
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Compartir Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  <strong>No vendemos tu información personal.</strong> Solo compartimos tu información en las
                  siguientes circunstancias:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Con Instructores:</strong> Información básica de progreso para mejorar la experiencia
                    educativa
                  </li>
                  <li>
                    <strong>Proveedores de Servicios:</strong> Empresas que nos ayudan a operar la plataforma (hosting,
                    pagos, análisis)
                  </li>
                  <li>
                    <strong>Cumplimiento Legal:</strong> Cuando sea requerido por ley o para proteger nuestros derechos
                  </li>
                  <li>
                    <strong>Transferencias Comerciales:</strong> En caso de fusión, adquisición o venta de activos
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Seguridad de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Medidas Técnicas</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Encriptación SSL/TLS para todas las transmisiones</li>
                      <li>• Encriptación de datos en reposo</li>
                      <li>• Autenticación de dos factores disponible</li>
                      <li>• Monitoreo continuo de seguridad</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Medidas Organizacionales</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Acceso limitado a datos personales</li>
                      <li>• Capacitación regular en privacidad</li>
                      <li>• Auditorías de seguridad periódicas</li>
                      <li>• Políticas estrictas de manejo de datos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Tus Derechos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">Tienes los siguientes derechos sobre tu información personal:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Acceso y Portabilidad</h4>
                      <p className="text-sm text-gray-600">Solicitar una copia de tu información personal</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Rectificación</h4>
                      <p className="text-sm text-gray-600">Corregir información inexacta o incompleta</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Eliminación</h4>
                      <p className="text-sm text-gray-600">Solicitar la eliminación de tu información</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Restricción</h4>
                      <p className="text-sm text-gray-600">Limitar el procesamiento de tus datos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies y Tecnologías Similares</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Puedes gestionar tus
                  preferencias de cookies en cualquier momento.
                </p>
                <div className="space-y-2">
                  <div>
                    <strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico de la plataforma
                  </div>
                  <div>
                    <strong>Cookies de Rendimiento:</strong> Nos ayudan a entender cómo usas la plataforma
                  </div>
                  <div>
                    <strong>Cookies de Funcionalidad:</strong> Recuerdan tus preferencias y configuraciones
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Retención de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Conservamos tu información personal solo durante el tiempo necesario para cumplir con los propósitos
                  descritos en esta política, a menos que la ley requiera un período de retención más largo. Los datos
                  de progreso educativo se conservan para mantener la validez de tus certificaciones.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700 mb-2">
                      Si tienes preguntas sobre esta política de privacidad o quieres ejercer tus derechos, contáctanos:
                    </p>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Email:</strong> privacidad@plataformadental.com
                      </div>
                      <div>
                        <strong>Dirección:</strong> Av. Universidad 123, Col. Del Valle, CDMX 03100
                      </div>
                      <div>
                        <strong>Teléfono:</strong> +52 (55) 1234-5678
                      </div>
                    </div>
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
