import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, BookOpen, CreditCard, Award, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Plataforma Educativa Dental",
  description: "Encuentra respuestas a las preguntas más comunes sobre nuestra plataforma educativa dental.",
}

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Cuenta y Registro",
      icon: Users,
      questions: [
        {
          question: "¿Cómo puedo crear una cuenta?",
          answer:
            "Puedes crear una cuenta haciendo clic en 'Registrarse' en la parte superior de la página. Solo necesitas tu email, nombre y elegir una contraseña segura. También puedes registrarte usando tu cuenta de Google o Facebook.",
        },
        {
          question: "¿Olvidé mi contraseña, qué hago?",
          answer:
            "En la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' e ingresa tu email. Te enviaremos un enlace para restablecer tu contraseña.",
        },
        {
          question: "¿Puedo cambiar mi información personal?",
          answer:
            "Sí, puedes actualizar tu información personal en cualquier momento desde tu perfil. Ve a 'Mi Cuenta' > 'Editar Perfil' para hacer cambios.",
        },
        {
          question: "¿Cómo elimino mi cuenta?",
          answer:
            "Si deseas eliminar tu cuenta, contacta a nuestro equipo de soporte. Ten en cuenta que esta acción es irreversible y perderás acceso a todos tus cursos y certificados.",
        },
      ],
    },
    {
      title: "Cursos y Contenido",
      icon: BookOpen,
      questions: [
        {
          question: "¿Cómo me inscribo a un curso?",
          answer:
            "Navega al curso que te interesa, revisa la información y haz clic en 'Inscribirse' o 'Comprar'. Podrás pagar con tarjeta de crédito, débito o PayPal.",
        },
        {
          question: "¿Puedo acceder a los cursos desde mi móvil?",
          answer:
            "Sí, nuestra plataforma es completamente responsive. Puedes acceder a todos los cursos desde tu smartphone, tablet o computadora.",
        },
        {
          question: "¿Los cursos tienen fecha de vencimiento?",
          answer:
            "No, una vez que te inscribes a un curso, tienes acceso de por vida al contenido, incluyendo futuras actualizaciones.",
        },
        {
          question: "¿Puedo descargar los videos para verlos offline?",
          answer:
            "Actualmente no ofrecemos descarga de videos, pero puedes acceder al contenido en cualquier momento con conexión a internet.",
        },
        {
          question: "¿Qué pasa si no entiendo algo del curso?",
          answer:
            "Cada curso tiene un foro donde puedes hacer preguntas al instructor y otros estudiantes. También puedes contactar directamente al instructor.",
        },
      ],
    },
    {
      title: "Pagos y Facturación",
      icon: CreditCard,
      questions: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer:
            "Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), PayPal y transferencias bancarias para algunos países.",
        },
        {
          question: "¿Puedo obtener un reembolso?",
          answer:
            "Ofrecemos una garantía de 30 días. Si no estás satisfecho con un curso, puedes solicitar un reembolso completo dentro de los primeros 30 días.",
        },
        {
          question: "¿Los precios incluyen impuestos?",
          answer:
            "Los precios mostrados pueden no incluir impuestos locales. Los impuestos aplicables se calcularán automáticamente durante el proceso de pago.",
        },
        {
          question: "¿Ofrecen descuentos para estudiantes?",
          answer:
            "Sí, ofrecemos descuentos especiales para estudiantes universitarios. Contacta a nuestro equipo con tu credencial estudiantil para más información.",
        },
        {
          question: "¿Cómo funciona la suscripción mensual?",
          answer:
            "Con la suscripción mensual tienes acceso ilimitado a todos los cursos de la plataforma. Se renueva automáticamente cada mes y puedes cancelar en cualquier momento.",
        },
      ],
    },
    {
      title: "Certificados",
      icon: Award,
      questions: [
        {
          question: "¿Cómo obtengo mi certificado?",
          answer:
            "Una vez que completes todas las lecciones y apruebes las evaluaciones del curso con al menos 80%, tu certificado se generará automáticamente.",
        },
        {
          question: "¿Los certificados son reconocidos oficialmente?",
          answer:
            "Nuestros certificados son reconocidos por instituciones educativas y empleadores en el sector dental. Cada certificado incluye un código de verificación único.",
        },
        {
          question: "¿Puedo verificar la autenticidad de un certificado?",
          answer:
            "Sí, cada certificado tiene un código QR y un enlace de verificación que permite confirmar su autenticidad en nuestra plataforma.",
        },
        {
          question: "¿Puedo reimprimir mi certificado?",
          answer:
            "Sí, puedes descargar e imprimir tu certificado las veces que necesites desde tu perfil en la sección 'Mis Certificados'.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Preguntas Frecuentes</h1>
            <p className="text-xl text-purple-100 leading-relaxed mb-8">
              Encuentra respuestas rápidas a las preguntas más comunes sobre nuestra plataforma educativa
            </p>

            {/* Buscador */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar en las preguntas frecuentes..."
                  className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-purple-600 hover:bg-gray-100">
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Categorías FAQ */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <section key={categoryIndex}>
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{category.title}</CardTitle>
                      <CardDescription>{category.questions.length} preguntas frecuentes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${categoryIndex}-${index}`} className="px-6">
                        <AccordionTrigger className="text-left hover:text-purple-600">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        {/* CTA */}
        <section className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">¿No encontraste lo que buscabas?</CardTitle>
              <CardDescription className="text-lg">
                Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta adicional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Contactar Soporte
                </Button>
                <Button size="lg" variant="outline">
                  Centro de Ayuda
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
