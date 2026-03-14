import PortfolioMenuSection from '@/app/components/PortfolioMenuSection'
import { enrichWorksWithMedia } from '@/app/components/work-data'
import type { SanityWork } from '@/app/components/work-types'
import { client } from '@/sanity/lib/client'
import { allWorksQuery } from '@/sanity/lib/queries'

export default async function WorksPage() {
    // Pagina Works: menu ordinato dei lavori professionali.
    const works: SanityWork[] = await client.fetch(allWorksQuery)
    const worksWithMedia = enrichWorksWithMedia(works)
    const worksOnly = worksWithMedia.filter(
        (work) => work.category?.slug?.current?.toLowerCase() !== 'series'
    )

    return (
        <main style={{ cursor: 'none' }}>
            <PortfolioMenuSection
                works={worksOnly}
                sectionId="works"
                headingText="Works"
                introText="Lavori realizzati su committenza: una selezione ordinata, con contesto e accesso alla pagina completa di ciascun progetto."
                emptyText="Nessun lavoro disponibile al momento."
            />
        </main>
    )
}
