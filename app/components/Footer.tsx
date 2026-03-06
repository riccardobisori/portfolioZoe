// Server Component — nessuna interazione, solo testo e link statici
// Non serve 'use client'

export default function Footer() {
    return (
        // id="contact" per il link nella Nav
        <footer
            id="contact"
            // Su mobile impila verticalmente, su desktop affianca orizzontalmente
            className="border-t px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0"
            style={{ borderColor: 'rgba(26,24,20,0.1)' }}
        >

            {/* Nome — serif corsivo, tenue */}
            <span style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '0.8rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--dust)',
            }}>
                Ginevra Zoe Giannelli
            </span>

            {/* Link social e contatti */}
            {/* Usiamo <a> normale perché sono link esterni */}
            <ul className="flex gap-8 list-none">
                {[
                    { label: 'Instagram', href: 'https://instagram.com' },
                    { label: 'Behance', href: 'https://behance.net' },
                    { label: 'Contatti', href: 'mailto:ginevra@example.com' },
                ].map((link) => (
                    <li key={link.label}>

                        <a href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            style={{
                                fontSize: '0.55rem',
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: 'var(--dust)',
                                textDecoration: 'none',
                                transition: 'color 0.3s ease',
                            }}
                        // Anche qui onMouseEnter richiede 'use client'...
                        // ma invece di convertire tutto il Footer, usiamo CSS puro
                        // tramite una classe — più efficiente per componenti semplici
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Copyright */}
            <span style={{
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                color: 'rgba(26,24,20,0.25)',
            }}>
                © {new Date().getFullYear()}
            </span>
            {/*
                new Date().getFullYear() restituisce l'anno corrente dinamicamente.
                In un Server Component viene eseguito sul server a build time —
                quindi l'anno si aggiorna automaticamente ad ogni deploy. 
                */}

        </footer>
    )
}