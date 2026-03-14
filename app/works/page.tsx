import WorkGallerySection from '@/app/components/WorkGallerySection'
import { enrichWorksWithMedia, mixWorksForMasonry } from '@/app/components/work-data'
import type { SanityWork } from '@/app/components/work-types'
import { client } from '@/sanity/lib/client'
import { allWorksQuery } from '@/sanity/lib/queries'

export default async function WorksPage() {
    // Pagina "Works" completa: usa tutti i lavori, non solo i featured.
    const works: SanityWork[] = await client.fetch(allWorksQuery)
    const worksWithMedia = enrichWorksWithMedia(works)
    const mixedWorks = mixWorksForMasonry(worksWithMedia)

    return (
        // Padding top per non coprire la prima riga sotto la navbar fixed.
        <main style={{ cursor: 'none', paddingTop: '92px' }}>
            <WorkGallerySection
                works={mixedWorks}
                sectionId="works"
                headingText="Works: lavori professionali"
            />
        </main>
    )
}
