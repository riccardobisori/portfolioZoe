'use client'

import Link from 'next/link'

export default function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        // Nav trasparente — diventa leggibile grazie al mix con l'immagine hero
        // Nessun background pesante, solo una linea sottile in basso
        borderBottom: '1px solid rgba(255,255,255,0.12)',
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
            color: 'white',
            // Linea sotto le iniziali — dettaglio Bauhaus
            borderBottom: '2px solid white',
            paddingBottom: '2px',
          }}>
            GZG
          </span>
        </Link>

        {/* Link di navigazione — bianchi su hero scuro */}
        <ul className="hidden md:flex gap-10 list-none">
          {[
            { label: 'Works',   href: '#works' },
            { label: 'About',   href: '#about' },
            { label: 'Series',  href: '#categories' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
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