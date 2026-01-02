'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FirmLogoProps {
  src: string | null
  fallback: string
  alt: string
  colorClass: string
}

export default function FirmLogo({ src, fallback, alt, colorClass }: FirmLogoProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const showImage = src && !hasError

  return (
    <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg overflow-hidden`}>
      {showImage && (
        <Image
          src={src}
          alt={alt}
          width={48}
          height={48}
          className={`object-contain transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
          unoptimized
        />
      )}
      {(!showImage || isLoading) && (
        <span className="text-white font-bold text-xs">
          {fallback}
        </span>
      )}
    </div>
  )
}
