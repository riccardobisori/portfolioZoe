import { urlFor } from '@/sanity/lib/image'
import type { HomePreviewCardDocument, SanityProject, ProjectWithUrl } from './project-types'

function isLandscapeFromRef(imageRef?: string) {
    if (!imageRef) return false
    const dimensionsMatch = imageRef.match(/-(\d+)x(\d+)-/)
    if (!dimensionsMatch) return false
    const originalWidth = parseInt(dimensionsMatch[1], 10)
    const originalHeight = parseInt(dimensionsMatch[2], 10)
    return originalWidth > originalHeight
}

// Trasforma i progetti "grezzi" in dati pronti per la UI:
// 1) URL immagine ottimizzato
// 2) flag orizzontale/verticale letto dal ref Sanity.
export function enrichProjectsWithMedia(projects: SanityProject[]): ProjectWithUrl[] {
    return projects.map((project) => {
        const isLandscape = isLandscapeFromRef(project.mainImage?.asset?._ref)

        return {
            ...project,
            imageUrl: project.mainImage ? urlFor(project.mainImage).width(1400).url() : null,
            isLandscape,
        }
    })
}

// Trasforma i documenti homePreviewCard in card renderizzabili.
// Ogni card punta a un progetto e puo usare un'immagine specifica.
export function mapHomePreviewCardsToProjects(cards: HomePreviewCardDocument[]): ProjectWithUrl[] {
    const expanded: ProjectWithUrl[] = []

    cards.forEach((card) => {
        const project = card.project
        if (!project || !project.slug?.current) return

        const image = card.image ?? project.mainImage ?? null
        expanded.push({
            ...project,
            _id: card._id,
            mainImage: image,
            previewLayout: card.previewLayout ?? null,
            imageUrl: image ? urlFor(image).width(1400).url() : null,
            isLandscape: isLandscapeFromRef(image?.asset?._ref),
        })
    })

    return expanded
}

// Mischia i progetti per una griglia più bilanciata:
// pattern base = 2 verticali, poi 1 orizzontale.
export function mixProjectsForMasonry(projects: ProjectWithUrl[]): ProjectWithUrl[] {
    const portraits = projects.filter((project) => !project.isLandscape)
    const landscapes = projects.filter((project) => project.isLandscape)
    const mixedProjects: ProjectWithUrl[] = []

    while (portraits.length > 0 || landscapes.length > 0) {
        const firstPortrait = portraits.shift()
        const secondPortrait = portraits.shift()
        const firstLandscape = landscapes.shift()

        if (firstPortrait) mixedProjects.push(firstPortrait)
        if (secondPortrait) mixedProjects.push(secondPortrait)
        if (firstLandscape) mixedProjects.push(firstLandscape)
    }

    return mixedProjects
}
