// Tipo "grezzo" così come arriva da Sanity.
// Qui teniamo solo i campi che usiamo nel frontend.
export interface ProjectPreviewLayoutValues {
    // Slot "guidato" scelto da editor CMS (es. leftTop, centerBottom, ecc.).
    preset?: string | null
    // Override manuali opzionali (percentuali): se presenti, prevalgono sul preset.
    x?: number | null
    y?: number | null
    width?: number | null
    // Profondita della card nella composizione (ordinamento sovrapposizioni).
    z?: number | null
    // Suggerimento orientamento per gli algoritmi fallback.
    preferred?: 'landscape' | 'portrait' | 'any' | null
}

export interface ProjectPreviewLayout extends ProjectPreviewLayoutValues {
    // Override opzionali per breakpoint desktop.
    responsive?: {
        desktop1024?: ProjectPreviewLayoutValues | null
        desktop1280?: ProjectPreviewLayoutValues | null
        desktop1440?: ProjectPreviewLayoutValues | null
        desktop1512?: ProjectPreviewLayoutValues | null
        desktop1536?: ProjectPreviewLayoutValues | null
        desktop1920?: ProjectPreviewLayoutValues | null
    } | null
}

export interface HomePreviewCardDocument {
    _id: string
    project?: SanityProject | null
    image?: {
        asset?: {
            _ref?: string
        }
    } | null
    previewLayout?: ProjectPreviewLayout | null
}

export interface SanityProject {
    _id: string
    title: string
    slug: { current: string }
    kind: 'work' | 'series'
    year: string
    description?: string | null
    mainImage: {
        asset?: {
            _ref?: string
        }
    } | null
}

// Tipo arricchito lato app: aggiungiamo URL immagine pronta
// e orientamento utile per la composizione masonry.
export interface ProjectWithUrl extends SanityProject {
    imageUrl: string | null
    isLandscape?: boolean
    // Layout opzionale usato solo dalle homePreviewCard.
    previewLayout?: ProjectPreviewLayout | null
}
