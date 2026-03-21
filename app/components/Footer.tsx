import Link from 'next/link'

const contactLinks = [
    { label: 'hello@gzgstudio.it', href: 'mailto:hello@gzgstudio.it', external: false },
    { label: '+39 333 000 0000', href: 'tel:+393330000000', external: false },
]

const navigationLinks = [
    { label: 'Home', href: '/' },
    { label: 'Works', href: '/works' },
    { label: 'About', href: '/#about' },
    { label: 'Series', href: '/series' },
]

const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Behance', href: 'https://behance.net' },
    { label: 'Vimeo', href: 'https://vimeo.com' },
]

const metaLabelStyle = {
    fontSize: 'clamp(0.54rem, 1.4vw, 0.6rem)',
    letterSpacing: '0.32em',
    textTransform: 'uppercase' as const,
    color: 'rgba(244,240,235,0.44)',
}

const secondaryLinkStyle = {
    display: 'inline-block',
    fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)',
    letterSpacing: '0.1em',
    color: 'rgba(244,240,235,0.74)',
    textDecoration: 'none',
    transition: 'color 220ms ease, opacity 220ms ease',
}

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer
            id="contact"
            data-cursor-scope
            className="site-footer"
            style={{
                position: 'relative',
                marginTop: 'clamp(1.1rem, 3vw, 2.5rem)',
                paddingTop: 'clamp(2rem, 4.5vw, 3.5rem)',
                paddingBottom: 'calc(clamp(1.5rem, 3vw, 2.5rem) + env(safe-area-inset-bottom, 0px))',
                paddingInline: 'clamp(1rem, 4vw, 3.25rem)',
                background:
                    'radial-gradient(circle at top left, rgba(200,184,154,0.08), transparent 28%), linear-gradient(180deg, #10100f 0%, #090909 100%)',
                borderTop: '1px solid rgba(244,240,235,0.14)',
            }}
        >
            <div
                className="max-w-[1400px] mx-auto w-full"
                style={{
                    display: 'grid',
                    gap: 'clamp(1.6rem, 3.2vw, 2.6rem)',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                        columnGap: 'clamp(1rem, 2.5vw, 2rem)',
                        rowGap: 'clamp(1rem, 2vw, 1.4rem)',
                        alignItems: 'end',
                    }}
                >
                    <div className="col-span-12 lg:col-span-8">
                        <p style={{ ...metaLabelStyle, marginBottom: '0.75rem' }}>
                            Contact
                        </p>
                        <h2
                            style={{
                                fontFamily: 'var(--font-cormorant)',
                                fontSize: 'clamp(1.7rem, 4.2vw, 3rem)',
                                fontWeight: 300,
                                lineHeight: 1,
                                letterSpacing: '-0.02em',
                                color: 'var(--cream)',
                                maxWidth: '13ch',
                            }}
                        >
                            Let&apos;s shape a visual story with quiet impact.
                        </h2>
                    </div>

                    <div className="col-span-12 lg:col-span-4">
                        <p
                            style={{
                                maxWidth: '31ch',
                                fontSize: 'clamp(0.76rem, 1.4vw, 0.88rem)',
                                lineHeight: 1.7,
                                letterSpacing: '0.07em',
                                color: 'rgba(244,240,235,0.58)',
                                marginBottom: '1rem',
                            }}
                        >
                            Fotografia editoriale e direzione visiva per moda, persone e narrazione contemporanea.
                        </p>
                        <a
                            href="mailto:hello@gzgstudio.it"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                color: 'var(--cream)',
                                textDecoration: 'none',
                                fontSize: 'clamp(0.72rem, 1.4vw, 0.82rem)',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                paddingBottom: '0.28rem',
                                borderBottom: '1px solid rgba(244,240,235,0.42)',
                                transition: 'color 220ms ease, border-color 220ms ease',
                            }}
                        >
                            Start a conversation <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </div>

                <div
                    style={{
                        borderTop: '1px solid rgba(244,240,235,0.14)',
                        borderBottom: '1px solid rgba(244,240,235,0.1)',
                        paddingTop: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                        paddingBottom: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                        columnGap: 'clamp(1rem, 2.5vw, 2rem)',
                        rowGap: 'clamp(1rem, 2vw, 1.5rem)',
                    }}
                >
                    <div className="col-span-12 md:col-span-6 lg:col-span-5">
                        <p style={{ ...metaLabelStyle, marginBottom: '1rem' }}>
                            Contact
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                alignItems: 'flex-start',
                            }}
                        >
                            {contactLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    {...(item.external
                                        ? { target: '_blank', rel: 'noopener noreferrer' }
                                        : {})}
                                    style={{
                                        display: 'inline-block',
                                        fontFamily: 'var(--font-cormorant)',
                                        fontSize: 'clamp(1.08rem, 2.1vw, 1.5rem)',
                                        lineHeight: 1,
                                        color: 'var(--cream)',
                                        textDecoration: 'none',
                                        transition: 'opacity 220ms ease',
                                    }}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <p
                                style={{
                                    fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)',
                                    letterSpacing: '0.1em',
                                    color: 'rgba(244,240,235,0.56)',
                                    textTransform: 'uppercase',
                                    marginTop: '0.35rem',
                                }}
                            >
                                Firenze, Italia
                            </p>
                        </div>
                    </div>

                    <div className="col-span-6 md:col-span-3 lg:col-span-3">
                        <p style={{ ...metaLabelStyle, marginBottom: '1rem' }}>
                            Navigate
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.8rem',
                                alignItems: 'flex-start',
                            }}
                        >
                            {navigationLinks.map((item) => (
                                <Link key={item.label} href={item.href} style={secondaryLinkStyle}>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-6 md:col-span-3 lg:col-span-2">
                        <p style={{ ...metaLabelStyle, marginBottom: '1rem' }}>
                            Social
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.8rem',
                                alignItems: 'flex-start',
                            }}
                        >
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={secondaryLinkStyle}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-2 lg:text-right">
                        <p style={{ ...metaLabelStyle, marginBottom: '1rem' }}>
                            Studio
                        </p>
                        <p
                            style={{
                                fontSize: 'clamp(0.7rem, 1.6vw, 0.78rem)',
                                letterSpacing: '0.1em',
                                lineHeight: 1.7,
                                color: 'rgba(244,240,235,0.58)',
                                maxWidth: '22ch',
                                marginLeft: 'auto',
                            }}
                        >
                            Ginevra Zoe Giannelli
                            <br />
                            Available for selected commissions and ongoing visual collaborations.
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.9rem 1.25rem',
                    }}
                >
                    <span
                        style={{
                            fontSize: 'clamp(0.56rem, 1.6vw, 0.64rem)',
                            letterSpacing: '0.22em',
                            color: 'rgba(244,240,235,0.42)',
                            textTransform: 'uppercase',
                        }}
                    >
                        © {year} GZG Studio
                    </span>
                    <Link
                        href="/#top"
                        style={{
                            ...secondaryLinkStyle,
                            fontSize: 'clamp(0.58rem, 1.6vw, 0.66rem)',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Back to top
                    </Link>
                </div>
            </div>
        </footer>
    )
}
