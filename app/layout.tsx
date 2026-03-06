import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'

// Use `next/font` to self-host Google fonts and expose them as CSS variables.
// CSS variables let us switch fonts in CSS/components without re-plumbing props.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

// Montserrat is the default UI/body font; keep weights lean for performance.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300'],
  variable: '--font-montserrat',
})

// Default SEO metadata for all routes (can be overridden per page/segment).
export const metadata: Metadata = {
  title: 'Ginevra Zoe Giannelli — Photography',
  description: 'Portfolio di Ginevra Zoe Giannelli',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Root HTML wrapper for the whole app.
    // We attach font variables on `<html>` so they’re available globally.
    <html lang="it" className={`${cormorant.variable} ${montserrat.variable}`}>
      {/* Inline font-family ensures a sane default without depending on component-level styles. */}
      <body style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}