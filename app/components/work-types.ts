// Tipo "grezzo" così come arriva da Sanity.
// Qui teniamo solo i campi che usiamo nel frontend.
export interface SanityWork {
    _id: string
    title: string
    slug: { current: string }
    year: string
    mainImage: {
        asset?: {
            _ref?: string
        }
    } | null
    category: {
        title: string
        slug: { current: string }
    }
}

// Tipo arricchito lato app: aggiungiamo URL immagine pronta
// e orientamento utile per la composizione masonry.
export interface WorkWithUrl extends SanityWork {
    imageUrl: string | null
    isLandscape?: boolean
}
