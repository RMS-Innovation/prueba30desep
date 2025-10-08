"use client"

interface Toast {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function toast({ title, description, variant = "default" }: Toast) {
  // Simular toast notification
  console.log(`Toast [${variant}]: ${title} - ${description}`)

  // En una implementación real, esto mostraría una notificación visual
  if (variant === "destructive") {
    alert(`Error: ${title}\n${description}`)
  } else {
    alert(`${title}\n${description}`)
  }
}

export function useToast() {
  return { toast }
}
