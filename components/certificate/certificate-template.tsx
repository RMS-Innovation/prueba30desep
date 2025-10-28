"use client"

import { Award, CheckCircle, Sparkles } from "lucide-react"

interface CertificateTemplateProps {
  studentName: string
  courseTitle: string
  instructor: string
  issueDate: string
  certificateId: string
  grade: string
}

export function CertificateTemplate({
  studentName,
  courseTitle,
  instructor,
  issueDate,
  certificateId,
  grade,
}: CertificateTemplateProps) {
  return (
    <div className="w-full bg-gradient-to-br from-white via-purple-50 to-white p-12 md:p-16 relative overflow-hidden min-h-[600px]">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 border-t-8 border-l-8 border-purple-600 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 border-t-8 border-r-8 border-purple-600 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 border-b-8 border-l-8 border-purple-600 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 border-b-8 border-r-8 border-purple-600 rounded-br-3xl" />

      {/* Inner decorative border */}
      <div className="absolute inset-8 md:inset-12 border-2 border-purple-300 rounded-2xl opacity-50" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-600 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-600 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center space-y-6 md:space-y-8">
        {/* Header with icon */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-30" />
            <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 p-4 md:p-6 rounded-full">
              <Award className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 bg-clip-text text-transparent">
              Certificado de Excelencia
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              <p className="text-base md:text-lg text-gray-600 font-medium">
                Este certificado se otorga con distinción a
              </p>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Student name with elegant styling */}
        <div className="py-4 md:py-6 px-8 md:px-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-purple-200">
          <h2 className="text-4xl md:text-6xl font-serif font-bold bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent">
            {studentName}
          </h2>
        </div>

        {/* Course details */}
        <div className="space-y-3 max-w-3xl px-4">
          <p className="text-base md:text-lg text-gray-700 font-medium">
            Por completar exitosamente el programa de formación
          </p>
          <div className="bg-white/80 backdrop-blur-sm px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-md border border-purple-200">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{courseTitle}</h3>
          </div>
          <p className="text-base md:text-lg text-gray-700">
            Bajo la instrucción del <span className="font-semibold text-purple-900">{instructor}</span>
          </p>
        </div>

        {/* Grade badge with enhanced styling */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg border-2 border-green-200">
          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          <span className="text-lg md:text-xl font-bold text-green-700">Calificación: {grade}</span>
        </div>

        {/* Footer with signatures */}
        <div className="pt-8 md:pt-12 space-y-6 w-full max-w-4xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4">
            <div className="text-center space-y-3">
              <div className="w-48 md:w-64 border-t-2 border-gray-400" />
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">Firma del Instructor</p>
                <p className="text-sm md:text-base font-bold text-gray-900">{instructor}</p>
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="w-48 md:w-64 border-t-2 border-gray-400" />
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">Fecha de Emisión</p>
                <p className="text-sm md:text-base font-bold text-gray-900">
                  {new Date(issueDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Certificate ID with QR placeholder */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 font-mono">ID de Verificación</p>
              <p className="text-xs md:text-sm font-bold text-purple-900">{certificateId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative sparkles */}
      <Sparkles className="absolute top-20 left-20 w-5 h-5 md:w-6 md:h-6 text-purple-400 opacity-50" />
      <Sparkles className="absolute top-24 right-24 w-6 h-6 md:w-8 md:h-8 text-purple-400 opacity-50" />
      <Sparkles className="absolute bottom-20 left-24 w-5 h-5 md:w-7 md:h-7 text-purple-400 opacity-50" />
      <Sparkles className="absolute bottom-24 right-20 w-5 h-5 md:w-6 md:h-6 text-purple-400 opacity-50" />
    </div>
  )
}
