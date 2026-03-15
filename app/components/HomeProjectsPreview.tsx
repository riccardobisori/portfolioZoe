import { client } from '@/sanity/lib/client'
import { homePreviewCardsQuery } from '@/sanity/lib/queries'
import MixedPreviewSection from './MixedPreviewSection'
import { mapHomePreviewCardsToProjects } from './project-data'
import type { HomePreviewCardDocument } from './project-types'

// Blocchetto "preview" della home:
// prende le card editoriali dedicate e le prepara per la masonry.
export default async function HomeProjectsPreview() {
    const cards: HomePreviewCardDocument[] = await client.fetch(homePreviewCardsQuery)
    const projectsWithMedia = mapHomePreviewCardsToProjects(cards)

    return (
        <MixedPreviewSection
            projects={projectsWithMedia}
            sectionId="preview"
        />
    )
}
