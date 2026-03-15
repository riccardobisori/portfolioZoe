'use client'

import Link from 'next/link'
import type { ProjectWithUrl } from './project-types'
import {
    getCardAspectRatio,
    getProjectHref,
    hasManualLayoutForBreakpoint,
    type DesktopBreakpointKey,
    type MoodboardSlot,
} from './mixed-preview-layout'

// Singola card desktop "assoluta" dentro al canvas moodboard.
// Riceve già slot e row dal parent: qui gestiamo solo rendering + hover behavior.
interface MixedPreviewDesktopCardProps {
    project: ProjectWithUrl
    slot: MoodboardSlot
    row: number
    rowOffsetPx: number
    breakpoint: DesktopBreakpointKey
    hoveredId: string | null
    setHoveredId: (id: string | null) => void
}

export default function MixedPreviewDesktopCard({
    project,
    slot,
    row,
    rowOffsetPx,
    breakpoint,
    hoveredId,
    setHoveredId,
}: MixedPreviewDesktopCardProps) {
    // Se la card è manuale per il breakpoint corrente:
    // - top/left/width/z arrivano dal CMS
    // altrimenti usa lo slot automatico con offset di riga.
    const hasManualPosition = hasManualLayoutForBreakpoint(project, breakpoint)
    const isHovered = hoveredId === project._id
    const top = hasManualPosition ? slot.top : `calc(${slot.top} + ${row * rowOffsetPx}px)`
    // Aspect ratio robusto: reale se disponibile, altrimenti fallback orientato.
    const aspectRatio = getCardAspectRatio(project, slot.preferred)

    return (
        <Link
            href={getProjectHref(project)}
            onMouseEnter={() => setHoveredId(project._id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(project._id)}
            onBlur={() => setHoveredId(null)}
            style={{
                position: 'absolute',
                top,
                left: slot.left,
                width: slot.width,
                textDecoration: 'none',
                color: 'inherit',
                // z-index alto in hover per evitare clipping con card vicine.
                zIndex: isHovered ? 120 : hasManualPosition ? slot.z : slot.z + row * 8,
                // Niente translate: solo micro-scale in hover.
                transform: `scale(${isHovered ? 1.015 : 1})`,
                transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1), z-index 0ms linear 120ms',
                willChange: 'transform',
                transformOrigin: 'center center',
                cursor: 'none',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio,
                }}
            >
                {/* Immagine card: statica, con shadow che si apre in hover. */}
                {project.imageUrl && (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            borderRadius: '1px',
                            border: '1px solid rgba(0, 0, 0, 0.28)',
                            objectFit: 'cover',
                            boxShadow: isHovered
                                ? '0 36px 72px rgba(26, 24, 20, 0.34)'
                                : '0 10px 24px rgba(26, 24, 20, 0.14)',
                            transition: 'box-shadow 420ms ease',
                        }}
                    />
                )}
                {/* Overlay testo desktop: compare solo in hover/focus. */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        padding: '0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        pointerEvents: 'none',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 240ms ease',
                    }}
                >
                    {/* Titolo e anno centrati, in stile "caption curatoriale". */}
                    <span
                        style={{
                            color: 'rgba(247,244,239,0.95)',
                            fontSize: 'clamp(0.66rem, 1vw, 0.82rem)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            lineHeight: 1.25,
                            textAlign: 'center',
                        }}
                    >
                        {project.title}
                    </span>
                    <span
                        style={{
                            color: 'rgba(247,244,239,0.78)',
                            fontSize: '0.56rem',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                        }}
                    >
                        {project.year}
                    </span>
                </div>
            </div>
        </Link>
    )
}
