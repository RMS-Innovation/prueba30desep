"use client"

import { useEffect, useState } from "react"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({ progress, size = 120, strokeWidth = 8, className }: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#a855f7"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{Math.round(animatedProgress)}%</span>
      </div>
    </div>
  )
}
