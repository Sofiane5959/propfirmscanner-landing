'use client'

import { useState, useEffect } from 'react'

interface ReadingProgressProps {
  color?: string
  height?: number
  showPercentage?: boolean
}

export default function ReadingProgress({ 
  color = '#10b981', 
  height = 3,
  showPercentage = false
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <>
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{ height: `${height}px` }}
      >
        <div 
          className="h-full transition-all duration-150 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Percentage Badge (optional) */}
      {showPercentage && progress > 0 && (
        <div 
          className="fixed top-4 right-4 z-[100] px-3 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </>
  )
}

// Variant: Circular Progress
export function CircularReadingProgress({ size = 48, strokeWidth = 4 }: { size?: number; strokeWidth?: number }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  if (progress < 5) return null

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="rgb(31 41 55)"
          stroke="rgb(55 65 81)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
        {Math.round(progress)}%
      </span>
    </div>
  )
}
