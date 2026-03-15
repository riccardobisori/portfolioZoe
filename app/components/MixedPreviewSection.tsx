'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { ProjectWithUrl } from './project-types'

interface MixedPreviewSectionProps {
    projects: ProjectWithUrl[]
    sectionId?: string
    headingText?: string
}

type MoodboardSlot = {
    top: string
    left: string
    width: string
    z: number
    preferred: 'landscape' | 'portrait' | 'any'
}

type MoodboardPresetKey =
    | 'auto'
    | 'leftTop'
    | 'centerTop'
    | 'rightTop'
    | 'rightNarrowTop'
    | 'leftBottom'
    | 'centerBottom'
    | 'rightBottom'
    | 'rightNarrowBottom'
    | 'leftThird'
    | 'centerThird'
    | 'rightThird'
    | 'rightNarrowThird'

type DesktopBreakpointKey = 'desktop1024' | 'desktop1440' | 'desktop1920'

// Slot "base" della moodboard desktop.
// Ogni slot definisce posizione, ingombro e priorità di orientamento.
const MOODBOARD_SLOTS: MoodboardSlot[] = [
    { top: '1%', left: '1%', width: '23%', z: 2, preferred: 'portrait' },
    { top: '6%', left: '24%', width: '33%', z: 2, preferred: 'landscape' },
    { top: '2%', left: '54%', width: '24%', z: 2, preferred: 'portrait' },
    { top: '6%', left: '75%', width: '17%', z: 1, preferred: 'portrait' },
    
    { top: '39%', left: '1%', width: '31%', z: 1, preferred: 'landscape' },
    { top: '34%', left: '34%', width: '24%', z: 2, preferred: 'portrait' },
    { top: '38%', left: '58%', width: '24%', z: 2, preferred: 'landscape' },
    { top: '44%', left: '75%', width: '16%', z: 1, preferred: 'portrait' },
    
    { top: '70%', left: '2%', width: '22%', z: 2, preferred: 'portrait' },
    { top: '74%', left: '26%', width: '32%', z: 1, preferred: 'landscape' },
    { top: '68%', left: '59%', width: '24%', z: 2, preferred: 'portrait' },
    { top: '76%', left: '84%', width: '15%', z: 1, preferred: 'portrait' },
]

const PREVIEW_LAYOUT_PRESETS: Record<Exclude<MoodboardPresetKey, 'auto'>, MoodboardSlot> = {
    leftTop: MOODBOARD_SLOTS[0],
    centerTop: MOODBOARD_SLOTS[1],
    rightTop: MOODBOARD_SLOTS[2],
    rightNarrowTop: MOODBOARD_SLOTS[3],
    leftBottom: MOODBOARD_SLOTS[4],
    centerBottom: MOODBOARD_SLOTS[5],
    rightBottom: MOODBOARD_SLOTS[6],
    rightNarrowBottom: MOODBOARD_SLOTS[7],
    leftThird: MOODBOARD_SLOTS[8],
    centerThird: MOODBOARD_SLOTS[9],
    rightThird: MOODBOARD_SLOTS[10],
    rightNarrowThird: MOODBOARD_SLOTS[11],
}

const MOODBOARD_BASE_HEIGHT = 1800
const MOODBOARD_ROW_HEIGHT = 600

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function parseImageDimensionsFromRef(imageRef?: string) {
    if (!imageRef) return null
    const match = imageRef.match(/-(\d+)x(\d+)-/)
    if (!match) return null
    const width = Number(match[1])
    const height = Number(match[2])
    if (!width || !height) return null
    return { width, height }
}

function getCardAspectRatio(project: ProjectWithUrl, preferred: MoodboardSlot['preferred']) {
    const fromImage = parseImageDimensionsFromRef(project.mainImage?.asset?._ref)
    if (fromImage) return `${fromImage.width} / ${fromImage.height}`
    return preferred === 'portrait' ? '2 / 3' : '3 / 2'
}

function getProjectHref(project: ProjectWithUrl) {
    const isSeries = project.kind === 'series'
    return isSeries ? `/series/${project.slug.current}` : `/works/${project.slug.current}`
}

function resolveLayoutForBreakpoint(layout: ProjectWithUrl['previewLayout'], breakpoint: DesktopBreakpointKey) {
    if (!layout) return null
    const override = layout.responsive?.[breakpoint]
    if (!override) return layout
    return {
        ...layout,
        preset: override.preset ?? layout.preset,
        x: override.x ?? layout.x,
        y: override.y ?? layout.y,
        width: override.width ?? layout.width,
        z: override.z ?? layout.z,
        preferred: override.preferred ?? layout.preferred,
    }
}

function hasManualLayoutForBreakpoint(project: ProjectWithUrl, breakpoint: DesktopBreakpointKey) {
    const layout = resolveLayoutForBreakpoint(project.previewLayout, breakpoint)
    if (!layout) return false
    return (
        (layout.preset != null && layout.preset !== 'auto') ||
        layout.x != null ||
        layout.y != null ||
        layout.width != null ||
        layout.z != null
    )
}

function resolveSlotFromBackend(project: ProjectWithUrl, fallbackSlot: MoodboardSlot, breakpoint: DesktopBreakpointKey): MoodboardSlot {
    // Pipeline:
    // 1) se c'è preset CMS, usiamo quello come base;
    // 2) applichiamo eventuali override x/y/width/z;
    // 3) se manca tutto, restiamo sul fallback automatico.
    const layout = resolveLayoutForBreakpoint(project.previewLayout, breakpoint)
    if (!layout) return fallbackSlot

    const presetKey = layout.preset as MoodboardPresetKey | null | undefined
    const presetSlot =
        presetKey && presetKey !== 'auto'
            ? PREVIEW_LAYOUT_PRESETS[presetKey as Exclude<MoodboardPresetKey, 'auto'>]
            : undefined

    const base = presetSlot ?? fallbackSlot
    const manualPreferred = layout.preferred === 'landscape' || layout.preferred === 'portrait' || layout.preferred === 'any'
        ? layout.preferred
        : undefined

    return {
        // Limitiamo i valori per evitare card fuori canvas o dimensioni ingestibili.
        top: layout.y != null ? `${clamp(layout.y, 0, 95)}%` : base.top,
        left: layout.x != null ? `${clamp(layout.x, 0, 90)}%` : base.left,
        width: layout.width != null ? `${clamp(layout.width, 10, 45)}%` : base.width,
        z: layout.z != null ? clamp(layout.z, 1, 10) : base.z,
        preferred: manualPreferred ?? base.preferred,
    }
}

function arrangeProjectsForMoodboard(projects: ProjectWithUrl[]) {
    // Separiamo i progetti per orientamento per abbinarli meglio agli slot.
    const portraits = projects.filter((project) => !project.isLandscape)
    const landscapes = projects.filter((project) => project.isLandscape)
    const arranged: ProjectWithUrl[] = []

    const pullLandscape = () => landscapes.shift() ?? portraits.shift()
    const pullPortrait = () => portraits.shift() ?? landscapes.shift()
    const pullAny = () =>
        (portraits.length >= landscapes.length ? portraits.shift() : landscapes.shift()) ??
        portraits.shift() ??
        landscapes.shift()

    for (let index = 0; index < projects.length; index += 1) {
        const slot = MOODBOARD_SLOTS[index % MOODBOARD_SLOTS.length]
        let selected: ProjectWithUrl | undefined

        if (slot.preferred === 'landscape') {
            selected = pullLandscape()
        } else if (slot.preferred === 'portrait') {
            selected = pullPortrait()
        } else {
            selected = pullAny()
        }

        if (selected) {
            arranged.push(selected)
        }
    }

    return arranged
}

function MoodboardCard({
    project,
    slot,
    row,
    breakpoint,
    hoveredId,
    setHoveredId,
}: {
    project: ProjectWithUrl
    slot: MoodboardSlot
    row: number
    breakpoint: DesktopBreakpointKey
    hoveredId: string | null
    setHoveredId: (id: string | null) => void
}) {
    const hasManualPosition = hasManualLayoutForBreakpoint(project, breakpoint)
    const isHovered = hoveredId === project._id
    const isRightEdgeSlot = !hasManualPosition && parseFloat(slot.left) >= 70
    const top = hasManualPosition ? slot.top : `calc(${slot.top} + ${row * 490}px)`
    const evenRow = row % 2 === 0
    const baseOffsetX = hasManualPosition
        ? 0
        : slot.preferred === 'landscape'
            ? (evenRow ? -4 : 4)
            : (evenRow ? -2 : 2)
    const baseOffsetY = hasManualPosition
        ? 0
        : slot.preferred === 'landscape'
            ? (evenRow ? -2 : 4)
            : (evenRow ? -1 : 3)
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
                zIndex: isHovered ? 120 : hasManualPosition ? slot.z : slot.z + row * 8,
                // Hover "soft": piccolo lift + scale moderata, senza spostamenti al centro.
                transform: `translate(${baseOffsetX + (isRightEdgeSlot ? -8 : 0)}px, ${baseOffsetY + (isHovered ? -2 : 0)}px) scale(${isHovered ? 1.03 : 1})`,
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
                            transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                            transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms ease',
                        }}
                    />
                )}
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

export default function MixedPreviewSection({
    projects,
    sectionId = 'preview',
}: MixedPreviewSectionProps) {
    const [isDesktop, setIsDesktop] = useState(false)
    const [desktopBreakpoint, setDesktopBreakpoint] = useState<DesktopBreakpointKey>('desktop1440')
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [hoveredCta, setHoveredCta] = useState<'works' | 'series' | null>(null)

    const showArchiveCta = sectionId === 'preview'
    const ctaLinkWidth = 'clamp(11.5rem, 18vw, 13.5rem)'
    // Se almeno un elemento ha layout manuale, non riordiniamo con l'algoritmo automatico.
    const shouldUseManualLayout = useMemo(
        () => projects.some((project) => hasManualLayoutForBreakpoint(project, desktopBreakpoint)),
        [desktopBreakpoint, projects]
    )
    // Applichiamo l'ordine "misto" una sola volta per render, non ad ogni paint.
    const arrangedProjects = useMemo(
        () => (shouldUseManualLayout ? projects : arrangeProjectsForMoodboard(projects)),
        [projects, shouldUseManualLayout]
    )

    useEffect(() => {
        const update = () => {
            const width = window.innerWidth
            setIsDesktop(width >= 1024)
            if (width >= 1760) setDesktopBreakpoint('desktop1920')
            else if (width >= 1366) setDesktopBreakpoint('desktop1440')
            else setDesktopBreakpoint('desktop1024')
        }

        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    const rows = Math.ceil(arrangedProjects.length / MOODBOARD_SLOTS.length)
    const desktopCanvasHeight = useMemo(() => {
        const extraRows = Math.max(rows - 1, 0)
        return `${MOODBOARD_BASE_HEIGHT + extraRows * MOODBOARD_ROW_HEIGHT}px`
    }, [rows])

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
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '-180px',
                    right: '-140px',
                    width: '420px',
                    height: '420px',
                    borderRadius: '999px',
                    background: 'radial-gradient(circle, rgba(200,184,154,0.2) 0%, rgba(200,184,154,0) 70%)',
                    pointerEvents: 'none',
                }}
            />
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

            {isDesktop ? (
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        // Safe area laterale: evita che le card tocchino i bordi viewport.
                        paddingLeft: 'clamp(4px, 0.8vw, 14px)',
                        paddingRight: 'clamp(5px, 1vw, 16px)',
                        height: desktopCanvasHeight,
                        minHeight: '980px',
                    }}
                >
                    {arrangedProjects.map((project, index) => {
                        const baseSlot = MOODBOARD_SLOTS[index % MOODBOARD_SLOTS.length]
                        // Slot finale = backend manuale (se presente) altrimenti slot automatico.
                        const slot = resolveSlotFromBackend(project, baseSlot, desktopBreakpoint)
                        const row = Math.floor(index / MOODBOARD_SLOTS.length)
                        return (
                            <MoodboardCard
                                key={project._id}
                                project={project}
                                slot={slot}
                                row={row}
                                breakpoint={desktopBreakpoint}
                                hoveredId={hoveredId}
                                setHoveredId={setHoveredId}
                            />
                        )
                    })}
                </div>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(12px, 2.6vw, 16px)',
                    }}
                >
                    {projects.map((project) => (
                        <Link
                            key={project._id}
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
                                style={{
                                    position: 'relative',
                                    width: '100vw',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {project.imageUrl && (
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: 'fit-content',
                                            maxWidth: '100vw',
                                        }}
                                    >
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            style={{
                                                width: 'auto',
                                                height: 'auto',
                                                maxWidth: '100vw',
                                                maxHeight: '84svh',
                                                display: 'block',
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                justifyContent: 'space-between',
                                                padding: 'clamp(0.5rem, 2vw, 0.8rem)',
                                                pointerEvents: 'none',
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
                                                }}
                                            >
                                                {project.year}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

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
                                    clipPath: hoveredCta === 'works' ? 'inset(0 0 0 0)' : 'inset(0 55% 0 0)',
                                    alignSelf: 'flex-end',
                                    transition: 'clip-path 320ms cubic-bezier(0.22, 1, 0.36, 1)',
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
                                    clipPath: hoveredCta === 'series' ? 'inset(0 0 0 0)' : 'inset(0 55% 0 0)',
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
