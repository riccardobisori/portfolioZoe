'use client'

import Link from 'next/link'

// Fixed top navigation bar with brand on the left
// and anchor links that smooth-scroll to sections on the page.
export default function Nav() {
    return (
        <nav style={{
            //position: 'fixed',
            //top: 0, left: 0, right: 0,
            zIndex: 50,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '2.5rem 3rem',
        }}>
            {/* Brand lockup: name + photography tag, using the serif display font */}
            <Link href="/" style={{
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
            </Link>

            <ul style={{
                // Horizontal list of navigation items aligned with the brand.
                display: 'flex',
                gap: '2.5rem',
                listStyle: 'none',
            }}>
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