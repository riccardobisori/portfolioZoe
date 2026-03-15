import type { ProjectWithUrl } from './project-types'

// Orientamento "preferito" di uno slot.
// Viene usato sia per il fallback del ratio, sia per il mixing automatico.
export type MoodboardPreferred = 'landscape' | 'portrait' | 'any'

// Geometria di una card sulla moodboard desktop.
// I valori sono percentuali (top/left/width) + z-index logico.
export type MoodboardSlot = {
    top: string
    left: string
    width: string
    z: number
    preferred: MoodboardPreferred
}

// Chiavi dei preset configurabili in Sanity.
// "auto" significa: usa il fallback calcolato in base alla sequenza.
export type MoodboardPresetKey =
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

export type DesktopBreakpointKey =
    | 'desktop1024'
    | 'desktop1280'
    | 'desktop1440'
    | 'desktop1512'
    | 'desktop1536'
    | 'desktop1920'

// Sequenza base degli slot nella composizione desktop.
// Quando non ci sono override editoriali, le card si appoggiano a questa griglia.
export const MOODBOARD_SLOTS: MoodboardSlot[] = [
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

// Mappa diretta preset -> slot della sequenza.
// Serve per tradurre il valore scelto in Sanity in coordinate concrete.
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

// Altezza "logica" canvas desktop per la prima riga.
// Le righe successive aumentano con MOODBOARD_ROW_HEIGHT.
export const MOODBOARD_BASE_HEIGHT = 1800
export const MOODBOARD_ROW_HEIGHT = 600

// Clamp difensivo per impedire valori fuori range quando arrivano override dal CMS.
function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

// Estrae dimensioni originali dal Sanity image ref (es. "...-1200x1800-...").
// Se non disponibili, il caller usa fallback ratio.
function parseImageDimensionsFromRef(imageRef?: string) {
    if (!imageRef) return null
    const match = imageRef.match(/-(\d+)x(\d+)-/)
    if (!match) return null
    const width = Number(match[1])
    const height = Number(match[2])
    if (!width || !height) return null
    return { width, height }
}

// Ratio usato dalla card desktop.
// Priorita:
// 1) ratio reale immagine (se parseabile dal ref)
// 2) ratio fallback coerente con orientamento preferito slot
export function getCardAspectRatio(project: ProjectWithUrl, preferred: MoodboardPreferred) {
    const fromImage = parseImageDimensionsFromRef(project.mainImage?.asset?._ref)
    if (fromImage) return `${fromImage.width} / ${fromImage.height}`
    return preferred === 'portrait' ? '2 / 3' : '3 / 2'
}

// URL di dettaglio uniforme per work/series.
export function getProjectHref(project: ProjectWithUrl) {
    const isSeries = project.kind === 'series'
    return isSeries ? `/series/${project.slug.current}` : `/works/${project.slug.current}`
}

// Conversione width viewport -> breakpoint logico usato da runtime e override CMS.
// Nota: le soglie riflettono i 6 viewport selezionabili nel builder Sanity.
export function getDesktopBreakpointForWidth(width: number): DesktopBreakpointKey {
    if (width >= 1920) return 'desktop1920'
    if (width >= 1536) return 'desktop1536'
    if (width >= 1512) return 'desktop1512'
    if (width >= 1440) return 'desktop1440'
    if (width >= 1280) return 'desktop1280'
    return 'desktop1024'
}

// Applica l'override responsive di uno specifico breakpoint.
// Se non esiste override, torna il layout "base" così com'è.
export function resolveLayoutForBreakpoint(layout: ProjectWithUrl['previewLayout'], breakpoint: DesktopBreakpointKey) {
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

// Determina se per quel breakpoint la card è "manuale":
// in quel caso evitiamo il comportamento puramente automatico.
export function hasManualLayoutForBreakpoint(project: ProjectWithUrl, breakpoint: DesktopBreakpointKey) {
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

// Risolve lo slot finale della card per il breakpoint corrente.
// Ordine di priorita:
// 1) preset esplicito dal CMS
// 2) fallback slot calcolato dalla sequenza moodboard
// Poi applica override puntuali (x/y/width/z/preferred) se presenti.
export function resolveSlotFromBackend(
    project: ProjectWithUrl,
    fallbackSlot: MoodboardSlot,
    breakpoint: DesktopBreakpointKey
): MoodboardSlot {
    // Nessun layout editoriale: usa direttamente il fallback calcolato in pagina.
    const layout = resolveLayoutForBreakpoint(project.previewLayout, breakpoint)
    if (!layout) return fallbackSlot

    const presetKey = layout.preset as MoodboardPresetKey | null | undefined
    const presetSlot =
        presetKey && presetKey !== 'auto'
            ? PREVIEW_LAYOUT_PRESETS[presetKey as Exclude<MoodboardPresetKey, 'auto'>]
            : undefined

    const base = presetSlot ?? fallbackSlot
    // Normalizza preferred: accettiamo solo valori validi, altrimenti fallback base.
    const manualPreferred =
        layout.preferred === 'landscape' || layout.preferred === 'portrait' || layout.preferred === 'any'
            ? layout.preferred
            : undefined

    return {
        // Clamp finali per robustezza: evitano card fuori canvas o troppo grandi/piccole.
        top: layout.y != null ? `${clamp(layout.y, 0, 95)}%` : base.top,
        left: layout.x != null ? `${clamp(layout.x, 0, 90)}%` : base.left,
        width: layout.width != null ? `${clamp(layout.width, 10, 45)}%` : base.width,
        z: layout.z != null ? clamp(layout.z, 1, 10) : base.z,
        preferred: manualPreferred ?? base.preferred,
    }
}

// Mixing automatico usato quando non ci sono layout manuali.
// Obiettivo: distribuire orientamenti in modo armonico rispetto agli slot.
export function arrangeProjectsForMoodboard(projects: ProjectWithUrl[]) {
    // Separa pool verticali/orizzontali per scegliere il prossimo elemento
    // in base alla preferenza dello slot corrente.
    const portraits = projects.filter((project) => !project.isLandscape)
    const landscapes = projects.filter((project) => project.isLandscape)
    const arranged: ProjectWithUrl[] = []

    // Fallback "elastici": se finisce un pool, pesca dall'altro.
    const pullLandscape = () => landscapes.shift() ?? portraits.shift()
    const pullPortrait = () => portraits.shift() ?? landscapes.shift()
    const pullAny = () =>
        (portraits.length >= landscapes.length ? portraits.shift() : landscapes.shift()) ??
        portraits.shift() ??
        landscapes.shift()

    // Visita ogni slot in sequenza e assegna la card più adatta.
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

        // Manteniamo la lista ordinata secondo la logica moodboard risolta.
        if (selected) arranged.push(selected)
    }

    return arranged
}
