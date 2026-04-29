/**
 * Utility: merge Tailwind classes safely.
 * Allows conditional classes + automatic deduplication of conflicting Tailwind utilities.
 *
 * Usage:
 *   cn('text-primary', condition && 'opacity-50', className)
 *
 * If you don't have clsx and tailwind-merge installed, run:
 *   npm install clsx tailwind-merge
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
