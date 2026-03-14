import { client } from '@/sanity/lib/client'
import { featuredWorksQuery } from '@/sanity/lib/queries'
import WorkGallerySection from './WorkGallerySection'
import { enrichWorksWithMedia, mixWorksForMasonry } from './work-data'
import type { SanityWork } from './work-types'

// Blocchetto "preview" della home:
// prende solo i featured works e li prepara per la masonry.
export default async function HomeWorksPreview() {
    const works: SanityWork[] = await client.fetch(featuredWorksQuery)
    const worksWithMedia = enrichWorksWithMedia(works)
    const mixedWorks = mixWorksForMasonry(worksWithMedia)

    return (
        <WorkGallerySection
            works={mixedWorks}
            sectionId="preview"
            headingText="Preview: selezione sparsa di lavori passati e recenti"
        />
    )
}
