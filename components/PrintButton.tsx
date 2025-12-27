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
      className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors ${className}`}
      aria-label="Print this page"
    >
      <Printer className="w-4 h-4" />
      <span>{label}</span>
    </button>
  )
}
