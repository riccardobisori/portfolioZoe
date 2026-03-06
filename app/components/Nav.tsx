'use client'

import Link from 'next/link'

// Fixed top navigation bar with brand on the left
// and anchor links that smooth-scroll to sections on the page.
export default function Nav() {
    return (
        // fixed = posizione fissa in alto
        // top-0 left-0 right-0 = occupa tutta la larghezza
        // flex justify-between = logo a sinistra, link a destra
        // px-6 md:px-12 = padding orizzontale: piccolo su mobile, grande su desktop
        // py-6 md:py-10 = padding verticale: piccolo su mobile, grande su desktop
        <nav className='fixed top-0 left-0 right-0 z-50 flex justify-between items-start px-6 md:px-12 py-6 md:py-10'>

            {/* Brand lockup: name + photography tag, using the serif display font */}
            <Link href="/" className="no-underline">
                <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontWeight: 300,
                    fontSize: '1rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const,
                    lineHeight: 1.4,
                    color: 'var(--ink)',
                    textDecoration: 'none',
                }}>
                    Ginevra Zoe Giannelli
                    <span style={{
                        display: 'block',
                        fontStyle: 'italic',
                        fontSize: '0.75rem',
                        letterSpacing: '0.35em',
                        color: 'var(--dust)',
                    }}>
                        Photography
                    </span>
                </span>
            </Link>

            {/* 
                hidden md:flex = nascosto su mobile, visibile da tablet in su.
                Su mobile i link di navigazione spariscono — 
                in futuro aggiungeremo un menu hamburger
            */}
            <ul className="hidden md:flex gap-10 list-none">

                {[
                    { label: 'Works', href: '#works' },
                    { label: 'About', href: '#about' },
                    { label: 'Series', href: '#categories' },
                    { label: 'Contact', href: '#contact' },
                ].map((item) => (
                    <li key={item.href}>
                        {/* Each item is a subtle uppercase link that darkens on hover. */}
                        <Link href={item.href} style={{
                            fontSize: '0.65rem',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase' as const,
                            color: 'var(--dust)',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust)')}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}