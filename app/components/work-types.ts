// Tipo "grezzo" così come arriva da Sanity.
// Qui teniamo solo i campi che usiamo nel frontend.
export interface WorkPreviewLayout {
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

export interface SanityWork {
    _id: string
    title: string
    slug: { current: string }
    year: string
    description?: string | null
    mainImage: {
        asset?: {
            _ref?: string
        }
    } | null
    category: {
        title: string
        slug: { current: string }
    }
    // Layout opzionale usato solo nella preview moodboard home.
    previewLayout?: WorkPreviewLayout | null
}

// Tipo arricchito lato app: aggiungiamo URL immagine pronta
// e orientamento utile per la composizione masonry.
export interface WorkWithUrl extends SanityWork {
    imageUrl: string | null
    isLandscape?: boolean
}
