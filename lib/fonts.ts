/**
 * Font setup using next/font for performance (no FOUT, auto-subset).
 *
 * Inter        — body text everywhere
 * Space Grotesk — display/heading typeface (distinctive, modern, free)
 * JetBrains Mono — tabular numbers in data displays (compare tables, stats)
 *
 * Import this file in your root layout.tsx and apply variables to <html> or <body>.
 *
 * Example layout.tsx usage:
 *   import { fontSans, fontDisplay, fontMono } from '@/lib/fonts'
 *
 *   <html lang={locale} className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} dark`}>
 *     <body className="font-sans bg-bg-base text-text-primary antialiased">
 *       {children}
 *     </body>
 *   </html>
 */
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700'],
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
})
