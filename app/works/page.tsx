import PortfolioMenuSection from '@/app/components/PortfolioMenuSection'
import { enrichProjectsWithMedia } from '@/app/components/project-data'
import type { SanityProject } from '@/app/components/project-types'
import { client } from '@/sanity/lib/client'
import { allProjectsQuery } from '@/sanity/lib/queries'

export default async function WorksPage() {
    // Pagina Works: menu ordinato dei lavori professionali.
    const projects: SanityProject[] = await client.fetch(allProjectsQuery)
    const projectsWithMedia = enrichProjectsWithMedia(projects)
    const worksOnly = projectsWithMedia.filter((project) => project.kind !== 'series')

    return (
        <main style={{ cursor: 'none' }}>
            <PortfolioMenuSection
                projects={worksOnly}
                sectionId="works"
                headingText="Works"
                introText="Lavori realizzati su committenza: una selezione ordinata, con contesto e accesso alla pagina completa di ciascun progetto."
                emptyText="Nessun lavoro disponibile al momento."
            />
        </main>
    )
}
