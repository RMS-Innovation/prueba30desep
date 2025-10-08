import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Términos y Condiciones | Plataforma Educativa Dental",
  description: "Lee nuestros términos y condiciones de uso para la plataforma educativa dental.",
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Scale className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Términos y Condiciones</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Conoce los términos que rigen el uso de nuestra plataforma educativa especializada en odontología
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
                <FileText className="h-6 w-6 text-purple-600" />
                <span>Resumen de Términos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Uso Educativo</h3>
                  <p className="text-sm text-gray-600">
                    Plataforma destinada exclusivamente para educación profesional
                  </p>
                </div>
                <div className="text-center">
                  <Scale className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Derechos y Deberes</h3>
                  <p className="text-sm text-gray-600">Conoce tus derechos como usuario y nuestras responsabilidades</p>
                </div>
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Uso Responsable</h3>
                  <p className="text-sm text-gray-600">Compromiso con el uso ético y profesional de la plataforma</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenido Principal */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Aceptación de los Términos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Al acceder y utilizar la Plataforma Educativa Dental operada por RG Servicios Médicos Integrales S.A
                  de C.V. en colaboración con el Instituto Autónomo del Norte (IAN), aceptas estar sujeto a estos
                  términos y condiciones.
                </p>
                <p className="text-gray-700">
                  Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestra plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Descripción del Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Nuestra plataforma ofrece cursos especializados en odontología que incluyen:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Cursos pregrabados y talleres prácticos hands-on</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Contenido educativo exclusivo del Instituto Autónomo del Norte</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Certificaciones digitales con validación de competencias</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Materiales complementarios descargables</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Foros de discusión y soporte de instructores</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Registro y Cuentas de Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold">Elegibilidad</h4>
                  <p className="text-gray-700">
                    Debes ser mayor de 18 años y tener la capacidad legal para celebrar contratos. Los cursos están
                    dirigidos a profesionales de la salud dental o estudiantes de odontología.
                  </p>

                  <h4 className="font-semibold">Responsabilidades del Usuario</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Proporcionar información precisa y actualizada</li>
                    <li>• Mantener la confidencialidad de tu contraseña</li>
                    <li>• Notificar inmediatamente cualquier uso no autorizado</li>
                    <li>• Ser responsable de todas las actividades en tu cuenta</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Uso Aceptable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600">Usos Permitidos</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Acceder al contenido educativo para tu desarrollo profesional</li>
                    <li>• Participar en foros y discusiones constructivas</li>
                    <li>• Descargar materiales para uso personal y educativo</li>
                    <li>• Compartir conocimientos de manera profesional</li>
                  </ul>

                  <h4 className="font-semibold text-red-600">Usos Prohibidos</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Compartir credenciales de acceso con terceros</li>
                    <li>• Descargar o distribuir contenido sin autorización</li>
                    <li>• Usar la plataforma para actividades comerciales no autorizadas</li>
                    <li>• Interferir con el funcionamiento de la plataforma</li>
                    <li>• Publicar contenido ofensivo, ilegal o inapropiado</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Pagos y Facturación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold">Precios y Pagos</h4>
                  <p className="text-gray-700">
                    Los precios se muestran en pesos mexicanos (MXN) e incluyen impuestos aplicables. Aceptamos tarjetas
                    de crédito, débito y PayPal.
                  </p>

                  <h4 className="font-semibold">Política de Reembolsos</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 30 días de garantía de satisfacción para cursos individuales</li>
                    <li>• Reembolsos procesados en 5-10 días hábiles</li>
                    <li>• No se reembolsan cursos completados al 100%</li>
                    <li>• Suscripciones pueden cancelarse en cualquier momento</li>
                  </ul>

                  <h4 className="font-semibold">Suscripciones</h4>
                  <p className="text-gray-700">
                    Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento desde tu perfil,
                    manteniendo acceso hasta el final del período pagado.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Propiedad Intelectual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold">Contenido de la Plataforma</h4>
                  <p className="text-gray-700">
                    Todo el contenido (videos, textos, imágenes, materiales) es propiedad de RG Servicios Médicos
                    Integrales y el Instituto Autónomo del Norte, protegido por derechos de autor y otras leyes de
                    propiedad intelectual.
                  </p>

                  <h4 className="font-semibold">Licencia de Uso</h4>
                  <p className="text-gray-700">
                    Te otorgamos una licencia limitada, no exclusiva y no transferible para acceder y usar el contenido
                    únicamente para fines educativos personales.
                  </p>

                  <h4 className="font-semibold">Contenido del Usuario</h4>
                  <p className="text-gray-700">
                    Mantienes los derechos sobre el contenido que publiques, pero nos otorgas una licencia para usar,
                    mostrar y distribuir dicho contenido en la plataforma.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Certificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold">Obtención de Certificados</h4>
                  <p className="text-gray-700">
                    Los certificados se otorgan al completar satisfactoriamente todos los módulos del curso y aprobar
                    las evaluaciones con una calificación mínima del 80%.
                  </p>

                  <h4 className="font-semibold">Validez y Reconocimiento</h4>
                  <p className="text-gray-700">
                    Nuestros certificados son reconocidos por instituciones educativas y empleadores del sector dental.
                    Cada certificado incluye verificación digital y código QR para autenticación.
                  </p>

                  <h4 className="font-semibold">Revocación</h4>
                  <p className="text-gray-700">
                    Nos reservamos el derecho de revocar certificados en caso de fraude, violación de términos o uso
                    indebido de la plataforma.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Limitación de Responsabilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    La plataforma se proporciona "tal como está". No garantizamos que el servicio sea ininterrumpido o
                    libre de errores. Nuestra responsabilidad se limita al monto pagado por el servicio específico.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Importante</h4>
                        <p className="text-yellow-700 text-sm">
                          El contenido educativo no sustituye la formación académica formal ni la experiencia clínica
                          supervisada. Los usuarios son responsables de cumplir con las regulaciones profesionales de su
                          jurisdicción.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Modificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos
                  se notificarán con 30 días de anticipación. El uso continuado de la plataforma constituye aceptación
                  de los términos modificados.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Ley Aplicable y Jurisdicción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta en los tribunales
                  competentes de la Ciudad de México.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">Para preguntas sobre estos términos, contáctanos:</p>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Email:</strong> legal@plataformadental.com
                    </div>
                    <div>
                      <strong>Dirección:</strong> Av. Universidad 123, Col. Del Valle, CDMX 03100
                    </div>
                    <div>
                      <strong>Teléfono:</strong> +52 (55) 1234-5678
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
