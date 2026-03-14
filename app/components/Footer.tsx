import Link from 'next/link'

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer
            id="contact"
            data-cursor-scope
            className="site-footer"
            style={{
                marginTop: 'clamp(1.25rem, 3.8vw, 3.5rem)',
                paddingTop: 'clamp(3rem, 7vw, 6rem)',
                paddingBottom: 'clamp(2rem, 5vw, 4rem)',
                paddingInline: 'clamp(1.25rem, 4vw, 3.25rem)',
                backgroundColor: '#0A0A0A',
                borderTop: '1px solid rgba(244,240,235,0.14)',
            }}
        >
            <div
                className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-y-14 md:gap-y-20 gap-x-10 md:gap-x-14"
                style={{ paddingTop: 'clamp(0.4rem, 1.2vw, 0.9rem)' }}
            >
                <div className="md:col-span-5">
                    <p
                        style={{
                            fontSize: '0.55rem',
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            color: 'rgba(244,240,235,0.45)',
                            marginBottom: '1.25rem',
                        }}
                    >
                        Studio
                    </p>
                    <h3
                        style={{
                            fontFamily: 'var(--font-cormorant)',
                            fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
                            fontWeight: 300,
                            lineHeight: 1.1,
                            color: 'var(--cream)',
                            marginBottom: '1.25rem',
                        }}
                    >
                        Ginevra Zoe Giannelli
                    </h3>
                    <p
                        style={{
                            maxWidth: '34ch',
                            fontSize: '0.62rem',
                            lineHeight: 2,
                            letterSpacing: '0.12em',
                            color: 'rgba(244,240,235,0.58)',
                        }}
                    >
                        Fotografia editoriale e direzione visiva tra moda, persone e narrazione contemporanea.
                    </p>
                </div>

                <div className="md:col-span-2">
                    <p
                        style={{
                            fontSize: '0.55rem',
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            color: 'rgba(244,240,235,0.45)',
                            marginBottom: '1rem',
                        }}
                    >
                        Contatti
                    </p>
                    <ul className="list-none flex flex-col gap-4">
                        {[
                            { label: 'hello@gzgstudio.it', href: 'mailto:hello@gzgstudio.it' },
                            { label: '+39 333 000 0000', href: 'tel:+393330000000' },
                            { label: 'Firenze, Italia', href: '#' },
                        ].map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    style={{
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.14em',
                                        color: 'rgba(244,240,235,0.74)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <p
                        style={{
                            fontSize: '0.55rem',
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            color: 'rgba(244,240,235,0.45)',
                            marginBottom: '1rem',
                        }}
                    >
                        Naviga
                    </p>
                    <ul className="list-none flex flex-col gap-4">
                        {[
                            { label: 'Home', href: '/' },
                            { label: 'Works', href: '/works' },
                            { label: 'About', href: '/#about' },
                            { label: 'Series', href: '/#categories' },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    style={{
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(244,240,235,0.74)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-3">
                    <p
                        style={{
                            fontSize: '0.55rem',
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            color: 'rgba(244,240,235,0.45)',
                            marginBottom: '1rem',
                        }}
                    >
                        Social
                    </p>
                    <ul className="list-none flex flex-col gap-4">
                        {[
                            { label: 'Instagram', href: 'https://instagram.com' },
                            { label: 'Behance', href: 'https://behance.net' },
                            { label: 'Vimeo', href: 'https://vimeo.com' },
                        ].map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(244,240,235,0.74)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div
                className="max-w-[1400px] mx-auto w-full mt-16 md:mt-20 pt-8 md:pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                style={{ borderTop: '1px solid rgba(244,240,235,0.14)' }}
            >
                <span
                    style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.2em',
                        color: 'rgba(244,240,235,0.45)',
                        textTransform: 'uppercase',
                    }}
                >
                    © {year} GZG Studio
                </span>
                <Link
                    href="/#top"
                    style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: 'rgba(244,240,235,0.72)',
                        textDecoration: 'none',
                    }}
                >
                    Back to top
                </Link>
            </div>

        </footer>
    )
}
