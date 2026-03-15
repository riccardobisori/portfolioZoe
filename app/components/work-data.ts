import { urlFor } from '@/sanity/lib/image'
import type { HomePreviewCardDocument, SanityWork, WorkWithUrl } from './work-types'

function isLandscapeFromRef(imageRef?: string) {
    if (!imageRef) return false
    const dimensionsMatch = imageRef.match(/-(\d+)x(\d+)-/)
    if (!dimensionsMatch) return false
    const originalWidth = parseInt(dimensionsMatch[1], 10)
    const originalHeight = parseInt(dimensionsMatch[2], 10)
    return originalWidth > originalHeight
}

// Trasforma i lavori "grezzi" in dati pronti per la UI:
// 1) URL immagine ottimizzato
// 2) flag orizzontale/verticale letto dal ref Sanity.
export function enrichWorksWithMedia(works: SanityWork[]): WorkWithUrl[] {
    return works.map((work) => {
        const isLandscape = isLandscapeFromRef(work.mainImage?.asset?._ref)

        return {
            ...work,
            imageUrl: work.mainImage ? urlFor(work.mainImage).width(1400).url() : null,
            isLandscape,
        }
    })
}

// Trasforma i documenti homePreviewCard in card renderizzabili.
// Ogni card punta a un progetto (work) e puo usare un'immagine specifica.
export function mapHomePreviewCardsToWorks(cards: HomePreviewCardDocument[]): WorkWithUrl[] {
    const expanded: WorkWithUrl[] = []

    cards.forEach((card) => {
        const project = card.project
        if (!project || !project.slug?.current) return

        const image = card.image ?? project.mainImage ?? null
        expanded.push({
            ...project,
            _id: card._id,
            mainImage: image,
            previewLayout: card.previewLayout ?? project.previewLayout ?? null,
            imageUrl: image ? urlFor(image).width(1400).url() : null,
            isLandscape: isLandscapeFromRef(image?.asset?._ref),
        })
    })

    return expanded
}

// Mischia i lavori per una griglia più bilanciata:
// pattern base = 2 verticali, poi 1 orizzontale.
export function mixWorksForMasonry(works: WorkWithUrl[]): WorkWithUrl[] {
    const portraits = works.filter((work) => !work.isLandscape)
    const landscapes = works.filter((work) => work.isLandscape)
    const mixedWorks: WorkWithUrl[] = []

    while (portraits.length > 0 || landscapes.length > 0) {
        const firstPortrait = portraits.shift()
        const secondPortrait = portraits.shift()
        const firstLandscape = landscapes.shift()

        if (firstPortrait) mixedWorks.push(firstPortrait)
        if (secondPortrait) mixedWorks.push(secondPortrait)
        if (firstLandscape) mixedWorks.push(firstLandscape)
    }

    return mixedWorks
}
