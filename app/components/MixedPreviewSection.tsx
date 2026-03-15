'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { ProjectWithUrl } from './project-types'
import MixedPreviewDesktopCard from './MixedPreviewDesktopCard'
import MixedPreviewMobileCard from './MixedPreviewMobileCard'
import {
    arrangeProjectsForMoodboard,
    getDesktopBreakpointForWidth,
    hasManualLayoutForBreakpoint,
    MOODBOARD_BASE_HEIGHT,
    MOODBOARD_ROW_HEIGHT,
    MOODBOARD_SLOTS,
    resolveSlotFromBackend,
    type DesktopBreakpointKey,
} from './mixed-preview-layout'

// Container principale:
// - decide branch desktop/mobile
// - calcola ordine/slot desktop
// - compone le CTA archivio in fondo.
interface MixedPreviewSectionProps {
    projects: ProjectWithUrl[]
    sectionId?: string
    headingText?: string
}

export default function MixedPreviewSection({
    projects,
    sectionId = 'preview',
}: MixedPreviewSectionProps) {
    // Gap mobile riusato sia come distanza fra card sia come padding laterale
    // per mantenere la "cornice" simmetrica.
    const mobileFrameGap = 'clamp(12px, 2.6vw, 16px)'
    // `isDesktop` determina il branch di rendering.
    const [isDesktop, setIsDesktop] = useState(false)
    const [desktopViewportWidth, setDesktopViewportWidth] = useState(1920)
    // Breakpoint logico desktop usato per risolvere override responsive dal CMS.
    const [desktopBreakpoint, setDesktopBreakpoint] = useState<DesktopBreakpointKey>('desktop1440')
    // Hover card desktop (overlay testo + z-index prioritaria).
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    // Hover CTA archivio (animazione sottolineatura).
    const [hoveredCta, setHoveredCta] = useState<'works' | 'series' | null>(null)

    const showArchiveCta = sectionId === 'preview'
    const ctaLinkWidth = 'clamp(11.5rem, 18vw, 13.5rem)'
    // Se almeno una card ha layout manuale nel breakpoint corrente,
    // non applichiamo il mixing automatico per rispettare l'editing CMS.
    const shouldUseManualLayout = useMemo(
        () => projects.some((project) => hasManualLayoutForBreakpoint(project, desktopBreakpoint)),
        [desktopBreakpoint, projects]
    )
    // Ordine finale desktop:
    // - manuale: ordine originale query
    // - automatico: mixing orientamenti per moodboard più equilibrata
    const arrangedProjects = useMemo(
        () => (shouldUseManualLayout ? projects : arrangeProjectsForMoodboard(projects)),
        [projects, shouldUseManualLayout]
    )

    useEffect(() => {
        // Sync responsive lato client:
        // - switch desktop/mobile
        // - selezione breakpoint "editoriale" in base alla viewport reale.
        const update = () => {
            const width = window.innerWidth
            setIsDesktop(width >= 1024)
            setDesktopViewportWidth(width)
            setDesktopBreakpoint(getDesktopBreakpointForWidth(width))
        }

        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    // Numero righe desktop in base al totale card e slot per riga.
    const rows = Math.ceil(arrangedProjects.length / MOODBOARD_SLOTS.length)
    // Riduce progressivamente il canvas sotto i 1920px per evitare troppo vuoto verticale.
    const desktopScale = useMemo(
        () => Math.min(1, Math.max(0.68, desktopViewportWidth / 1920)),
        [desktopViewportWidth]
    )
    const scaledBaseHeight = Math.round(MOODBOARD_BASE_HEIGHT * desktopScale)
    const scaledRowHeight = Math.round(MOODBOARD_ROW_HEIGHT * desktopScale)
    const desktopRowOffsetPx = Math.round(490 * desktopScale)
    const desktopMinHeight = Math.round(980 * desktopScale)
    // Altezza canvas desktop: base + contributo per righe extra.
    const desktopCanvasHeight = useMemo(() => {
        const extraRows = Math.max(rows - 1, 0)
        return `${scaledBaseHeight + extraRows * scaledRowHeight}px`
    }, [rows, scaledBaseHeight, scaledRowHeight])

    // Non renderizziamo la sezione se non ci sono card.
    if (projects.length === 0) return null

    return (
        <section
            id={sectionId}
            data-cursor-scope
            style={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: 'clamp(66px, 7vw, 96px)',
                paddingBottom: 'clamp(2px, 0.6vw, 8px)',
                paddingLeft: isDesktop ? 'clamp(16px, 3vw, 48px)' : 0,
                paddingRight: isDesktop ? 'clamp(16px, 3vw, 48px)' : 0,
            }}
        >
            {/* Etichetta di sezione. */}
            <div
                style={{
                    marginBottom: 'clamp(18px, 3.4vw, 34px)',
                    borderBottom: '1px solid rgba(26,24,20,0.16)',
                    paddingBottom: 'clamp(0.65rem, 1.5vw, 0.95rem)',
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: '0.56rem',
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: 'rgba(26,24,20,0.56)',
                    }}
                >
                    Curated Mix
                </p>
            </div>

            {/* Desktop: composizione assoluta moodboard con slot risolti per card. */}
            {isDesktop ? (
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        paddingLeft: 'clamp(4px, 0.8vw, 14px)',
                        paddingRight: 'clamp(5px, 1vw, 16px)',
                        height: desktopCanvasHeight,
                        minHeight: `${desktopMinHeight}px`,
                    }}
                >
                    {arrangedProjects.map((project, index) => {
                        // Slot base ciclico della griglia.
                        const baseSlot = MOODBOARD_SLOTS[index % MOODBOARD_SLOTS.length]
                        // Slot finale dopo merge con eventuale override editoriale CMS.
                        const slot = resolveSlotFromBackend(project, baseSlot, desktopBreakpoint)
                        // Riga corrente per offset verticale/z-index progressivo.
                        const row = Math.floor(index / MOODBOARD_SLOTS.length)
                        return (
                            <MixedPreviewDesktopCard
                                key={project._id}
                                project={project}
                                slot={slot}
                                row={row}
                                rowOffsetPx={desktopRowOffsetPx}
                                breakpoint={desktopBreakpoint}
                                hoveredId={hoveredId}
                                setHoveredId={setHoveredId}
                            />
                        )
                    })}
                </div>
            ) : (
                // Mobile: lista lineare con cornice laterale e card autonome.
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: mobileFrameGap,
                        paddingLeft: mobileFrameGap,
                        paddingRight: mobileFrameGap,
                    }}
                >
                    {projects.map((project) => (
                        <MixedPreviewMobileCard key={project._id} project={project} />
                    ))}
                </div>
            )}

            {/* CTA archivio visibili solo nella home preview section. */}
            {showArchiveCta && (
                <div
                    style={{
                        marginTop: 'clamp(2.2rem, 5vw, 4rem)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '0.62rem',
                        }}
                    >
                        <Link
                            href="/series"
                            onMouseEnter={() => setHoveredCta('series')}
                            onMouseLeave={() => setHoveredCta(null)}
                            style={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                width: ctaLinkWidth,
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
                                    display: 'block',
                                    width: '100%',
                                    height: 0,
                                    borderTop: '1px solid rgba(26, 24, 20, 0.82)',
                                    // Stessa animazione della CTA Works, con stato dedicato.
                                    clipPath: hoveredCta === 'series' ? 'inset(0 0 0 0)' : 'inset(0 55% 0 0)',
                                    alignSelf: 'flex-end',
                                    transition: 'clip-path 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            />
                        </Link>
                        <Link
                            href="/works"
                            onMouseEnter={() => setHoveredCta('works')}
                            onMouseLeave={() => setHoveredCta(null)}
                            style={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                width: ctaLinkWidth,
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
                                    display: 'block',
                                    width: '100%',
                                    height: 0,
                                    borderTop: '1px solid rgba(26, 24, 20, 0.82)',
                                    // Sottolineatura "wipe" guidata dallo stato hover.
                                    clipPath: hoveredCta === 'works' ? 'inset(0 0 0 0)' : 'inset(0 55% 0 0)',
                                    alignSelf: 'flex-end',
                                    transition: 'clip-path 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            />
                        </Link>
                    </div>
                </div>
            )}
        </section>
    )
}
