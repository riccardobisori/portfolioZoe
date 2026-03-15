import { client } from '@/sanity/lib/client'
import { featuredWorksQuery, homePreviewCardsQuery } from '@/sanity/lib/queries'
import MixedPreviewSection from './MixedPreviewSection'
import { enrichWorksWithMedia, mapHomePreviewCardsToWorks } from './work-data'
import type { HomePreviewCardDocument, SanityWork } from './work-types'

// Blocchetto "preview" della home:
// prende le card editoriali dedicate e le prepara per la masonry.
export default async function HomeWorksPreview() {
    const cards: HomePreviewCardDocument[] = await client.fetch(homePreviewCardsQuery)
    const worksWithMedia = cards.length > 0
        ? mapHomePreviewCardsToWorks(cards)
        : enrichWorksWithMedia(await client.fetch<SanityWork[]>(featuredWorksQuery))

    return (
        <MixedPreviewSection
            works={worksWithMedia}
            sectionId="preview"
        />
    )
}
