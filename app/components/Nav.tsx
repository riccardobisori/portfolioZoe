'use client'

import Link from 'next/link'

export default function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        // Nav trasparente — diventa leggibile grazie al mix con l'immagine hero
        // Nessun background pesante, solo una linea sottile in basso
        borderBottom: '1px solid var(--ink)',
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-6 md:py-8">

        {/* Logo — solo iniziali, bold, display font */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.1rem',
            fontWeight: 400,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            animation: 'fadeIn 1s ease 1s forwards',
            opacity: '0'
          }}>
            GZG
          </span>
        </Link>

        {/* Link di navigazione — bianchi su hero scuro */}
        <ul className="hidden md:flex gap-10 list-none">
          {[
            { label: 'Works', href: '#works' },
            { label: 'About', href: '#about' },
            { label: 'Series', href: '#categories' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--ink)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--ink)'
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  )
}