import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, BookOpen, Video, CreditCard, Award, MessageCircle, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Centro de Ayuda | Plataforma Educativa Dental",
  description: "Encuentra respuestas a tus preguntas y obtén soporte técnico para tu experiencia de aprendizaje.",
}

export default function AyudaPage() {
  const helpCategories = [
    {
      title: "Primeros Pasos",
      description: "Aprende a usar la plataforma",
      icon: BookOpen,
      articles: [
        "Cómo crear tu cuenta",
        "Completar tu perfil",
        "Navegar por la plataforma",
        "Configurar notificaciones",
      ],
    },
    {
      title: "Cursos y Contenido",
      description: "Todo sobre cursos y lecciones",
      icon: Video,
      articles: ["Cómo inscribirse a un curso", "Reproducir videos", "Descargar materiales", "Seguimiento de progreso"],
    },
    {
      title: "Pagos y Facturación",
      description: "Información sobre pagos",
      icon: CreditCard,
      articles: [
        "Métodos de pago aceptados",
        "Política de reembolsos",
        "Suscripciones y renovaciones",
        "Problemas de facturación",
      ],
    },
    {
      title: "Certificaciones",
      description: "Obtén y verifica certificados",
      icon: Award,
      articles: ["Cómo obtener certificados", "Verificar autenticidad", "Descargar certificados", "Compartir logros"],
    },
  ]

  const popularArticles = [
    "¿Cómo puedo acceder a mis cursos?",
    "¿Qué hacer si olvido mi contraseña?",
    "¿Cómo descargar mi certificado?",
    "¿Puedo ver los cursos en mi móvil?",
    "¿Cómo contactar a un instructor?",
    "¿Cuál es la política de reembolsos?",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Centro de Ayuda</h1>
            <p className="text-xl text-purple-100 leading-relaxed mb-8">
              Encuentra respuestas rápidas a tus preguntas o contacta a nuestro equipo de soporte
            </p>

            {/* Buscador */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar en el centro de ayuda..."
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
        {/* Categorías de Ayuda */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">¿En qué podemos ayudarte?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <category.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, idx) => (
                      <li key={idx} className="text-sm text-gray-600 hover:text-purple-600 cursor-pointer">
                        • {article}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Artículos Populares */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Artículos Más Consultados</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Preguntas Frecuentes</CardTitle>
                <CardDescription>Las consultas más comunes de nuestros usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <HelpCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700 hover:text-purple-600">{article}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contacto */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">¿Necesitas Más Ayuda?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Chat en Vivo</h3>
              <p className="text-gray-600 mb-6">Habla directamente con nuestro equipo de soporte</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Iniciar Chat</Button>
            </Card>

            <Card className="p-6 text-center">
              <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Soporte Telefónico</h3>
              <p className="text-gray-600 mb-6">Llámanos de lunes a viernes de 9:00 AM a 6:00 PM</p>
              <Button variant="outline">+52 (55) 1234-5678</Button>
            </Card>
          </div>
        </section>

        {/* Recursos Adicionales */}
        <section>
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Recursos Adicionales</CardTitle>
              <CardDescription className="text-lg">
                Explora más recursos para aprovechar al máximo tu experiencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                  <Video className="h-6 w-6" />
                  <span>Tutoriales en Video</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                  <BookOpen className="h-6 w-6" />
                  <span>Guías PDF</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                  <MessageCircle className="h-6 w-6" />
                  <span>Comunidad</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
