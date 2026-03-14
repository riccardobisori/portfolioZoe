'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { WorkWithUrl } from './work-types'

// Preview mista in home: contiene lavori eterogenei (Works + Series).
interface MixedPreviewSectionProps {
    works: WorkWithUrl[]
    sectionId?: string
    headingText?: string
}

const MOBILE_MASONRY_GAP = 8
const DESKTOP_MASONRY_GAP = 10

// Singola card della griglia masonry.
function MasonryCard({ work, masonryGap }: { work: WorkWithUrl; masonryGap: number }) {
    const cardRef = useRef<HTMLAnchorElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [hovered, setHovered] = useState(false)
    const [isLandscape, setIsLandscape] = useState(work.isLandscape || false)
    const [rowSpan, setRowSpan] = useState(200)

    // Reveal on scroll: aggiunge classe "visible" quando la card entra in viewport.
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
            { threshold: 0.08 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // Calcola lo span verticale reale in base all'altezza renderizzata dell'immagine.
    useEffect(() => {
        if (!contentRef.current) return

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.target.getBoundingClientRect().height
                setRowSpan(Math.ceil(height) + masonryGap)
            }
        })

        resizeObserver.observe(contentRef.current)
        return () => resizeObserver.disconnect()
    }, [masonryGap])

    return (
        <Link
            ref={cardRef}
            href={`/works/${work.slug.current}`}
            className="reveal"
            style={{
                display: 'block',
                position: 'relative',
                cursor: 'none',
                textDecoration: 'none',
                color: 'inherit',
                gridColumn: isLandscape ? 'span 2' : 'span 1',
                gridRowEnd: `span ${rowSpan}`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div ref={contentRef} style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                {work.imageUrl && (
                    <img
                        src={work.imageUrl}
                        alt={work.title}
                        onLoad={(e) => {
                            const img = e.target as HTMLImageElement
                            setIsLandscape(img.naturalWidth > img.naturalHeight)
                        }}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: '2px',
                            transform: hovered ? 'scale(1.03)' : 'scale(1)',
                            transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                        }}
                    />
                )}

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(26,24,20,0.5)',
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'var(--font-brunoaceSC)',
                            fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            color: 'var(--cream)',
                            letterSpacing: '0.01em',
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translateY(0)' : 'translateY(10px)',
                            transition: 'opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s',
                        }}
                    >
                        {work.category?.title}
                    </span>
                    <span
                        style={{
                            fontSize: '0.48rem',
                            letterSpacing: '0.4em',
                            textTransform: 'uppercase',
                            color: 'rgba(244,240,235,0.55)',
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
                            transition: 'opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s',
                        }}
                    >
                        {work.title}
                    </span>
                </div>
            </div>
        </Link>
    )
}

// Sezione gallery generica: stessa UI, contenuti diversi a seconda della pagina.
export default function MixedPreviewSection({
    works,
    sectionId = 'preview',
    headingText = 'Preview: Works + Series',
}: MixedPreviewSectionProps) {
    const [masonryGap, setMasonryGap] = useState(MOBILE_MASONRY_GAP)
    const [hoveredCta, setHoveredCta] = useState<'works' | 'series' | null>(null)
    const showArchiveCta = sectionId === 'preview'

    // Gap diverso mobile/desktop per una resa visiva più equilibrata.
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)')
        const updateGap = () => {
            setMasonryGap(mediaQuery.matches ? DESKTOP_MASONRY_GAP : MOBILE_MASONRY_GAP)
        }

        updateGap()
        mediaQuery.addEventListener('change', updateGap)
        return () => mediaQuery.removeEventListener('change', updateGap)
    }, [])

    if (works.length === 0) return null

    return (
        <section
            id={sectionId}
            data-cursor-scope
            style={{
                width: '100%',
                paddingTop: '58px',
                paddingBottom: '20px',
                paddingLeft: 'clamp(16px, 3vw, 48px)',
                paddingRight: 'clamp(16px, 3vw, 48px)',
            }}
        >
            <h2
                style={{
                    margin: 0,
                    marginBottom: 'clamp(16px, 3vw, 30px)',
                    marginLeft: 'auto',
                    width: 'fit-content',
                    fontFamily: 'var(--font-monserrat)',
                    fontSize: 'clamp(0.85rem, 1.35vw, 1.05rem)',
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    color: 'var(--charcoal)',
                    textAlign: 'right',
                }}
            >
                {headingText}
            </h2>
            <div
                style={{
                    display: 'grid',
                    width: '100%',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    // Righe da 1px: ci permette di pilotare altezza card via rowSpan.
                    gridAutoRows: '1px',
                    // "dense" prova a riempire i buchi lasciati da elementi più alti.
                    gridAutoFlow: 'dense',
                    columnGap: `${masonryGap}px`,
                }}
            >
                {works.map((work) => (
                    <MasonryCard key={work._id} work={work} masonryGap={masonryGap} />
                ))}
            </div>
            {showArchiveCta && (
                <div
                    style={{
                        marginTop: 'clamp(1.1rem, 2.8vw, 2.2rem)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.62rem' }}>
                        <Link
                            href="/works"
                            onMouseEnter={() => setHoveredCta('works')}
                            onMouseLeave={() => setHoveredCta(null)}
                            style={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: '0.26rem',
                                textDecoration: 'none',
                                color: 'var(--ink)',
                                cursor: 'none',
                                letterSpacing: '0.11em',
                                textTransform: 'uppercase',
                                fontSize: 'clamp(0.66rem, 0.9vw, 0.78rem)',
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}
                        >
                            <span>View Works Archive {'\u2192'}</span>
                            <span
                                style={{
                                    width: '100%',
                                    height: '2px',
                                    background: 'rgba(26, 24, 20, 0.75)',
                                    transformOrigin: 'left center',
                                    transform: hoveredCta === 'works' ? 'scaleX(1)' : 'scaleX(0.45)',
                                    transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            />
                        </Link>
                        <Link
                            href="/series"
                            onMouseEnter={() => setHoveredCta('series')}
                            onMouseLeave={() => setHoveredCta(null)}
                            style={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: '0.26rem',
                                textDecoration: 'none',
                                color: 'var(--ink)',
                                cursor: 'none',
                                letterSpacing: '0.11em',
                                textTransform: 'uppercase',
                                fontSize: 'clamp(0.66rem, 0.9vw, 0.78rem)',
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}
                        >
                            <span>View Series Archive {'\u2192'}</span>
                            <span
                                style={{
                                    width: '100%',
                                    height: '2px',
                                    background: 'rgba(26, 24, 20, 0.75)',
                                    transformOrigin: 'left center',
                                    transform: hoveredCta === 'series' ? 'scaleX(1)' : 'scaleX(0.45)',
                                    transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            />
                        </Link>
                    </div>
                </div>
            )}
        </section>
    )
}
