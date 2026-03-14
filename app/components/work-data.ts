import { urlFor } from '@/sanity/lib/image'
import type { SanityWork, WorkWithUrl } from './work-types'

// Trasforma i lavori "grezzi" in dati pronti per la UI:
// 1) URL immagine ottimizzato
// 2) flag orizzontale/verticale letto dal ref Sanity.
export function enrichWorksWithMedia(works: SanityWork[]): WorkWithUrl[] {
    return works.map((work) => {
        let isLandscape = false

        if (work.mainImage?.asset?._ref) {
            const ref = work.mainImage.asset._ref
            const dimensionsMatch = ref.match(/-(\d+)x(\d+)-/)
            if (dimensionsMatch) {
                const originalWidth = parseInt(dimensionsMatch[1], 10)
                const originalHeight = parseInt(dimensionsMatch[2], 10)
                isLandscape = originalWidth > originalHeight
            }
        }

        return {
            ...work,
            imageUrl: work.mainImage ? urlFor(work.mainImage).width(1400).url() : null,
            isLandscape,
        }
    })
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
