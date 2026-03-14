import PortfolioMenuSection from '@/app/components/PortfolioMenuSection'
import { enrichWorksWithMedia } from '@/app/components/work-data'
import type { SanityWork } from '@/app/components/work-types'
import { client } from '@/sanity/lib/client'
import { allWorksQuery } from '@/sanity/lib/queries'

export default async function SeriesPage() {
  // Pagina Series: lavori autoriali/personali.
  const works: SanityWork[] = await client.fetch(allWorksQuery)
  const worksWithMedia = enrichWorksWithMedia(works)
  const seriesOnly = worksWithMedia.filter(
    (work) => work.category?.slug?.current?.toLowerCase() === 'series'
  )

  return (
    <main style={{ cursor: 'none' }}>
      <PortfolioMenuSection
        works={seriesOnly}
        sectionId="series"
        headingText="Series"
        introText="Progetti autonomi e di ricerca: percorsi personali, sviluppati in continuità e raccolti per serie."
        emptyText="Nessuna serie disponibile al momento."
      />
    </main>
  )
}
