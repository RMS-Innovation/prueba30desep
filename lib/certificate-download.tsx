export interface CertificateData {
  studentName: string
  courseTitle: string
  instructor: string
  issueDate: string
  certificateId: string
  grade: string
}

export async function downloadCertificateAsPDF(certificateData: CertificateData): Promise<void> {
  try {
    // Load libraries from CDN
    const html2canvas = await loadHtml2Canvas()
    const jsPDF = await loadJsPDF()

    // Create a temporary container for the certificate
    const container = document.createElement("div")
    container.style.position = "fixed"
    container.style.left = "-9999px"
    container.style.top = "0"
    document.body.appendChild(container)

    // Render certificate HTML
    container.innerHTML = generateCertificateHTML(certificateData)

    // Wait for fonts and images to load
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Remove temporary container
    document.body.removeChild(container)

    // Create PDF
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save(`certificado-${certificateData.courseTitle.replace(/\s+/g, "-")}.pdf`)
  } catch (error) {
    console.error("[v0] Error downloading certificate:", error)
    alert("Error al descargar el certificado. Por favor, intenta nuevamente.")
  }
}

function loadHtml2Canvas(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).html2canvas) {
      resolve((window as any).html2canvas)
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
    script.onload = () => resolve((window as any).html2canvas)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function loadJsPDF(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).jspdf) {
      resolve((window as any).jspdf.jsPDF)
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    script.onload = () => resolve((window as any).jspdf.jsPDF)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function generateCertificateHTML(data: CertificateData): string {
  return `
    <div style="width: 1122px; height: 794px; background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); padding: 60px; font-family: 'Georgia', serif; position: relative; overflow: hidden;">
      <!-- Decorative corners -->
      <div style="position: absolute; top: 0; left: 0; width: 200px; height: 200px; border-top: 8px solid #7c3aed; border-left: 8px solid #7c3aed; opacity: 0.3;"></div>
      <div style="position: absolute; top: 0; right: 0; width: 200px; height: 200px; border-top: 8px solid #7c3aed; border-right: 8px solid #7c3aed; opacity: 0.3;"></div>
      <div style="position: absolute; bottom: 0; left: 0; width: 200px; height: 200px; border-bottom: 8px solid #7c3aed; border-left: 8px solid #7c3aed; opacity: 0.3;"></div>
      <div style="position: absolute; bottom: 0; right: 0; width: 200px; height: 200px; border-bottom: 8px solid #7c3aed; border-right: 8px solid #7c3aed; opacity: 0.3;"></div>

      <!-- Content -->
      <div style="text-align: center; position: relative; z-index: 1;">
        <h1 style="font-size: 56px; font-weight: bold; background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 20px 0;">
          Certificado de Excelencia
        </h1>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 40px;">
          <span style="font-size: 24px;">✨</span>
          <p style="font-size: 20px; color: #64748b; margin: 0;">Este certificado se otorga con distinción a</p>
          <span style="font-size: 24px;">✨</span>
        </div>

        <div style="background: white; border-radius: 16px; padding: 30px 60px; margin: 0 auto 30px; box-shadow: 0 10px 40px rgba(124, 58, 237, 0.15); display: inline-block;">
          <h2 style="font-size: 64px; font-weight: bold; color: #7c3aed; margin: 0;">${data.studentName}</h2>
        </div>

        <p style="font-size: 22px; color: #475569; margin: 0 0 30px 0; line-height: 1.6;">
          Por completar exitosamente el programa de formación
        </p>

        <div style="background: white; border-radius: 16px; padding: 24px 48px; margin: 0 auto 30px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); display: inline-block;">
          <h3 style="font-size: 42px; font-weight: bold; color: #1e293b; margin: 0;">${data.courseTitle}</h3>
        </div>

        <p style="font-size: 20px; color: #64748b; margin: 0 0 30px 0;">
          Bajo la instrucción del <span style="color: #7c3aed; font-weight: 600;">${data.instructor}</span>
        </p>

        <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 50px; padding: 16px 40px; margin: 0 auto 40px; display: inline-flex; align-items: center; gap: 12px;">
          <span style="font-size: 28px;">✓</span>
          <span style="font-size: 24px; font-weight: 600; color: #065f46;">Calificación: ${data.grade}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
          <div style="text-align: left;">
            <p style="font-size: 16px; color: #94a3b8; margin: 0 0 4px 0;">Fecha de emisión</p>
            <p style="font-size: 18px; font-weight: 600; color: #475569; margin: 0;">${data.issueDate}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 16px; color: #94a3b8; margin: 0 0 4px 0;">ID de Certificado</p>
            <p style="font-size: 18px; font-weight: 600; color: #475569; margin: 0;">${data.certificateId}</p>
          </div>
        </div>
      </div>
    </div>
  `
}
