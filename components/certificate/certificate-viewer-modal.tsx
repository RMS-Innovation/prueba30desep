"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Maximize2, X } from "lucide-react"
import { CertificateTemplate } from "./certificate-template"
import { useRef, useState } from "react"

interface CertificateViewerModalProps {
  isOpen: boolean
  onClose: () => void
  certificate: {
    courseTitle: string
    instructor: string
    issueDate: string
    certificateId: string
    grade: string
  }
  studentName: string
}

export function CertificateViewerModal({ isOpen, onClose, certificate, studentName }: CertificateViewerModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleDownload = async () => {
    if (!certificateRef.current) return

    setIsDownloading(true)

    try {
      // Dynamically load html2canvas and jsPDF from CDN
      const html2canvas = await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
        "html2canvas",
      )
      const jsPDF = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "jspdf")

      // Get the certificate element
      const element = certificateRef.current

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      // Calculate PDF dimensions (A4 landscape)
      const imgWidth = 297 // A4 width in mm (landscape)
      const imgHeight = 210 // A4 height in mm (landscape)

      const pdf = new jsPDF.jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      // Add image to PDF
      const imgData = canvas.toDataURL("image/png")
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Download PDF
      const fileName = `Certificado_${certificate.courseTitle.replace(/\s+/g, "_")}_${certificate.certificateId}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error al generar el PDF. Por favor, intenta de nuevo.")
    } finally {
      setIsDownloading(false)
    }
  }

  const loadScript = (src: string, globalName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any)[globalName]) {
        resolve((window as any)[globalName])
        return
      }

      const script = document.createElement("script")
      script.src = src
      script.onload = () => resolve((window as any)[globalName])
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const handleFullScreen = () => {
    setIsFullScreen(true)
  }

  const handleCloseFullScreen = () => {
    setIsFullScreen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Vista Previa del Certificado</span>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleFullScreen}
                  size="sm"
                  variant="outline"
                  className="border-purple-800 text-purple-800 hover:bg-purple-50 bg-transparent"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Ver en Grande
                </Button>
                <Button
                  id="certificate-download-trigger"
                  onClick={handleDownload}
                  size="sm"
                  className="bg-purple-800 hover:bg-purple-900"
                  disabled={isDownloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? "Generando PDF..." : "Descargar PDF"}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="w-full flex items-center justify-center bg-gray-100 p-4 rounded-lg">
            <div ref={certificateRef} className="bg-white rounded-lg shadow-2xl w-full max-w-5xl">
              <CertificateTemplate
                studentName={studentName}
                courseTitle={certificate.courseTitle}
                instructor={certificate.instructor}
                issueDate={certificate.issueDate}
                certificateId={certificate.certificateId}
                grade={certificate.grade}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isFullScreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-start justify-center overflow-auto p-8">
          <Button
            onClick={handleCloseFullScreen}
            size="icon"
            variant="ghost"
            className="fixed top-4 right-4 text-white hover:bg-white/20 z-10"
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="w-full min-h-full flex items-center justify-center py-8">
            <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full">
              <CertificateTemplate
                studentName={studentName}
                courseTitle={certificate.courseTitle}
                instructor={certificate.instructor}
                issueDate={certificate.issueDate}
                certificateId={certificate.certificateId}
                grade={certificate.grade}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
