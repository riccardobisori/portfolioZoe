'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SanityWork } from './Works'

// Estendiamo il tipo SanityWork aggiungendo imageUrl
interface WorkWithUrl extends SanityWork {
    imageUrl: string | null
}

// ── HOVER OVERLAY ─────────────────────────────────────────────────────────
function HoverOverlay() {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--ink)',
                opacity: hovered ? 0.15 : 0,
                transition: 'opacity 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
            }}
        >
            <span style={{
                fontSize: '0.6rem',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'white',
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.4s ease 0.1s',
            }}>
                Visualizza
            </span>
        </div>
    )
}

// ── WORK CARD ─────────────────────────────────────────────────────────────
function WorkCard({ work, index }: { work: WorkWithUrl; index: number }) {
    const cardRef = useRef<HTMLAnchorElement>(null)
    const aspectRatios = ['3/4', '4/5', '2/3', '1/1']
    const cardAspectRatio = aspectRatios[index % aspectRatios.length]

    useEffect(() => {
        const el = cardRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible')
                    observer.unobserve(el)
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <Link
            ref={cardRef}
            href={`/works/${work.slug.current}`}
            className="reveal"
            style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'none',
                display: 'inline-block',
                width: '100%',
                textDecoration: 'none',
                color: 'inherit',
                breakInside: 'avoid',
                marginBottom: '1.5rem',
            }}
        >
            <div style={{
                width: '100%',
                aspectRatio: cardAspectRatio,
                position: 'relative',
                overflow: 'hidden',
                minHeight: '260px',
            }}>
                {work.imageUrl ? (
                    // Componente Image di Next.js — ottimizza automaticamente
                    // le immagini: WebP, lazy loading, dimensioni responsive
                    <Image
                        src={work.imageUrl}
                        alt={work.title}
                        fill                    // riempie il contenitore padre
                        style={{ objectFit: 'cover' }}  // come background-size: cover
                        sizes="(max-width: 768px) 100vw, 33vw"
                    // sizes dice al browser quanto è grande l'immagine
                    // in base alla larghezza dello schermo — ottimizza il download
                    />
                ) : (
                    // Fallback se non c'è immagine
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #c5bdb4, #9e968e)',
                    }} />
                )}

                <HoverOverlay />
            </div>

            {/* Info sotto la foto */}
            <div style={{
                padding: '1rem 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
            }}>
                <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--ink)',
                }}>
                    {work.title}
                </span>
                <span style={{
                    fontSize: '0.55rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'var(--dust)',
                }}>
                    {work.category?.title} · {work.year}
                </span>
            </div>
        </Link>
    )
}

// ── COMPONENTE PRINCIPALE ─────────────────────────────────────────────────
export default function WorksClient({ works }: { works: WorkWithUrl[] }) {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible')
                    observer.unobserve(el)
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <section id="works" className="px-6 md:px-12 py-20 md:py-32">

            <div
                ref={headerRef}
                className="reveal"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '4rem',
                    borderBottom: '1px solid rgba(26,24,20,0.1)',
                    paddingBottom: '1.5rem',
                }}
            >
                <span style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'var(--dust)',
                }}>
                    Selected Works
                </span>
                <h2 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--ink)',
                }}>
                    Ultimi lavori
                </h2>
                <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '0.85rem',
                    color: 'var(--dust)',
                    letterSpacing: '0.1em',
                }}>
                    2023 — 2024
                </span>
            </div>

            {/* Se non ci sono lavori in evidenza mostra un messaggio */}
            {works.length === 0 ? (
                <p style={{ color: 'var(--dust)', fontSize: '0.8rem' }}>
                    Nessun lavoro in evidenza — aggiungine uno dallo Studio Sanity.
                </p>
            ) : (
                <div
                    style={{
                        columnGap: '1.5rem',
                        columnCount: 1,
                    }}
                    className="md:[column-count:2] lg:[column-count:3]"
                >
                    {works.map((work, index) => (
                        <WorkCard
                            key={work._id}
                            work={work}
                            index={index}
                        />
                    ))}
                </div>
            )}

        </section>
    )
}
