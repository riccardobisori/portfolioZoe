'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { ProjectWithUrl } from './project-types'
import { getProjectHref } from './mixed-preview-layout'

// Singola card mobile full-width (entro la cornice del parent).
// Qui gestiamo il comportamento "testo ritardato in viewport".
interface MixedPreviewMobileCardProps {
    project: ProjectWithUrl
}

export default function MixedPreviewMobileCard({ project }: MixedPreviewMobileCardProps) {
    // Ref usato dall'IntersectionObserver per capire quando la card entra in viewport.
    const cardRef = useRef<HTMLDivElement | null>(null)
    // Stato "la card e visibile abbastanza da essere considerata letta".
    const [isInView, setIsInView] = useState(false)
    // Stato che abilita la comparsa di tutto il blocco testo (titolo + anno).
    const [showText, setShowText] = useState(false)

    useEffect(() => {
        const node = cardRef.current
        if (!node) return

        // threshold 0.55: richiediamo una presenza sostanziale della card
        // prima di avviare il timer, evitando trigger troppo anticipati.
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                setIsInView(entry.isIntersecting)
            },
            { threshold: 0.55 }
        )

        observer.observe(node)
        // Cleanup obbligatorio per evitare observer "orfani" in navigazione.
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        // Timer one-shot:
        // - parte solo quando la card e in view
        // - non riparte se il testo e gia comparso.
        if (showText || !isInView) return
        const timer = window.setTimeout(() => setShowText(true), 1200)
        // Cleanup se la card esce dalla viewport prima della scadenza.
        return () => window.clearTimeout(timer)
    }, [isInView, showText])

    return (
        <Link
            href={getProjectHref(project)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: 'auto',
                paddingTop: 0,
                paddingBottom: 0,
                textDecoration: 'none',
                color: 'inherit',
            }}
        >
            <div
                ref={cardRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {project.imageUrl && (
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                        }}
                    >
                        {/* Immagine mobile: occupa la larghezza utile della card. */}
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '84svh',
                                display: 'block',
                            }}
                        />
                        {/* Overlay testo mobile: compare in modo morbido e ritardato. */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.35rem',
                                padding: '0.9rem',
                                pointerEvents: 'none',
                                // Tutto il blocco (titolo+anno) con stessa animazione.
                                opacity: showText ? 1 : 0,
                                transform: `translateY(${showText ? 0 : 4}px)`,
                                transition: 'opacity 780ms ease-out, transform 780ms cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.58rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(247,244,239,0.96)',
                                    lineHeight: 1.2,
                                    textAlign: 'center',
                                }}
                            >
                                {project.title}
                            </span>
                            <span
                                style={{
                                    fontSize: '0.56rem',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(247,244,239,0.9)',
                                    lineHeight: 1.2,
                                    textAlign: 'center',
                                }}
                            >
                                {project.year}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    )
}
