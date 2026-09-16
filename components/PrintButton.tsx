'use client'

import { Printer } from 'lucide-react'

interface PrintButtonProps {
  className?: string
  label?: string
}

export default function PrintButton({ className = '', label = 'Print' }: PrintButtonProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className={`inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-text-secondary hover:text-white hover:bg-dark-600 transition-colors ${className}`}
      aria-label="Print this page"
    >
      <Printer className="w-4 h-4" />
      <span>{label}</span>
    </button>
  )
}
