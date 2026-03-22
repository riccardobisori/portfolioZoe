import Nav from '@/app/components/Nav'
import PortfolioMenuSection from '@/app/components/PortfolioMenuSection'
import { enrichProjectsWithMedia } from '@/app/components/project-data'
import type { SanityProject } from '@/app/components/project-types'
import { client } from '@/sanity/lib/client'
import { allProjectsQuery } from '@/sanity/lib/queries'

export default async function SeriesPage() {
  // Pagina Series: lavori autoriali/personali.
  const projects: SanityProject[] = await client.fetch(allProjectsQuery)
  const projectsWithMedia = enrichProjectsWithMedia(projects)
  const seriesOnly = projectsWithMedia.filter((project) => project.kind === 'series')

  return (
    <main style={{ cursor: 'none' }}>
      {/* Anche nella pagina Series lasciamo visibile la navbar globale:
          chi arriva qui deve poter tornare subito alle altre sezioni del sito. */}
      <Nav />
      <PortfolioMenuSection
        projects={seriesOnly}
        sectionId="series"
        headingText="Series"
        introText="Progetti autonomi e di ricerca: percorsi personali, sviluppati in continuità e raccolti per serie."
        emptyText="Nessuna serie disponibile al momento."
      />
    </main>
  )
}
