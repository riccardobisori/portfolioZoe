'use client'

import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface HeroProps {
    heroImage: any | null
}

export default function Hero({ heroImage }: HeroProps) {
    // Costruiamo l'URL dell'immagine se esiste
    // width(1920) = risoluzione massima per schermi grandi
    // quality(90) = qualità alta ma non massima, bilancia peso e qualità
    const imageUrl = heroImage
        ? urlFor(heroImage).width(1920).height(1080).quality(90).url()
        : null

    return (
        // Sezione a tutto schermo — position relative per contenere
        // l'immagine assoluta e il testo sovrapposto
        <section style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            background: '#111', // fallback mentre l'immagine carica
        }}>

            {/* ── IMMAGINE A TUTTO SCHERMO ── */}
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="Ginevra Zoe Giannelli"
                    fill
                    // priority = carica subito, è above the fold
                    // senza priority Next.js la carica in lazy — vedremmo un flash nero
                    priority
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        // Animazione fadeIn — l'immagine appare dolcemente
                        opacity: 0,
                        animation: 'fadeIn 1.4s ease 0.1s forwards',
                    }}
                />
            ) : (
                // Fallback se non c'è immagine su Sanity
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(145deg, #2a2a2a 0%, #111 60%, #000 100%)',
                }} />
            )}

            {/* Overlay scuro graduato dal basso — rende il testo leggibile
          senza schiacciare l'immagine sopra */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
                zIndex: 1,
            }} />

            {/* ── ELEMENTO GEOMETRICO BAUHAUS ── */}
            {/* Rettangolo vuoto — cornice geometrica, non riempito
          Bauhaus usa la geometria come struttura, non come decorazione */}
            <div
                className="hidden md:block"
                style={{
                    position: 'absolute',
                    top: '18%',
                    right: '10%',
                    width: '120px',
                    height: '120px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    zIndex: 2,
                    opacity: 0,
                    animation: 'fadeIn 1.2s ease 0.8s forwards',
                }}
            />

            {/* Linea orizzontale sottile — divide lo spazio, principio Bauhaus */}
            <div
                className="hidden md:block"
                style={{
                    position: 'absolute',
                    left: '6%',
                    right: '6%',
                    bottom: '22%',
                    height: '1px',
                    background: 'rgba(255,255,255,0.15)',
                    zIndex: 2,
                    opacity: 0,
                    animation: 'fadeIn 1s ease 1s forwards',
                }}
            />

            {/* ── CONTENUTO TESTUALE ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end', // testo ancorato in basso
                padding: 'clamp(2rem, 6vw, 5rem)',
                paddingBottom: 'clamp(3rem, 8vw, 6rem)',
            }}>

                {/* Nome completo — piccolo, discreto, sopra il titolo */}
                <p style={{
                    fontSize: '0.58rem',
                    letterSpacing: '0.45em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '1.25rem',
                    opacity: 0,
                    animation: 'fadeUp 0.9s ease 0.3s forwards',
                }}>
                    Ginevra Zoe Giannelli
                </p>

                {/* Titolo principale — grande, bold, Bauhaus */}
                {/* Cormorant Garamond in uppercase perde il carattere serif
                e diventa geometrico — perfetto per Bauhaus */}
                <h1 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'clamp(3.5rem, 9vw, 9rem)',
                    fontWeight: 300,
                    letterSpacing: '0.08em',
                    lineHeight: 0.9,
                    color: 'white',
                    textTransform: 'uppercase',
                    opacity: 0,
                    animation: 'fadeUp 0.9s ease 0.5s forwards',
                }}>
                    PINO<br />
                    {/* 
                        'Works' in corsivo — rompe la rigidità Bauhaus con un gesto
                        calligrafico. Tensione tra geometrico e organico.
                    */}
                    <em style={{
                        fontStyle: 'italic',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.75)',
                    }}>
                        BRUNO
                    </em>
                </h1>

                {/* Riga inferiore — categorie + CTA affiancati */}
                <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    opacity: 0,
                    animation: 'fadeUp 0.9s ease 0.8s forwards',
                }}>

                    {/* Categorie — testo piccolo, come caption editoriale */}
                    <p style={{
                        fontSize: '0.58rem',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                    }}>
                        Moda&nbsp;&nbsp;·&nbsp;&nbsp;Street&nbsp;&nbsp;·&nbsp;&nbsp;Ritratti&nbsp;&nbsp;·&nbsp;&nbsp;Paesaggio
                    </p>

                    {/* CTA — minimal, solo testo con freccia */}
                    <Link
                        href="#works"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '0.58rem',
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            color: 'white',
                            textDecoration: 'none',
                            transition: 'gap 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.gap = '1.6rem'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.gap = '1rem'
                        }}
                    >
                        Archivio
                        {/* Freccia geometrica — linea + quadrato, puro Bauhaus */}
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            <span style={{
                                display: 'block',
                                width: '32px',
                                height: '1px',
                                background: 'white',
                            }} />
                            <span style={{
                                display: 'block',
                                width: '5px',
                                height: '5px',
                                border: '1px solid white',
                                transform: 'rotate(45deg)',
                            }} />
                        </span>
                    </Link>

                </div>
            </div>

        </section>
    )
}