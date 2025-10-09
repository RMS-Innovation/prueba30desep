import type React from "react"

import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Plataforma Educativa Dental - Instituto Autónomo del Norte",
  description: "Plataforma de educación on-demand para profesionales dentales",
  generator: "Next.js",
  keywords: ["odontología", "educación dental", "cursos online", "certificaciones"],
  authors: [{ name: "RG Servicios Médicos Integrales" }],
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${dmSans.variable} antialiased`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
