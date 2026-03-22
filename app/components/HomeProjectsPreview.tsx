import { client } from '@/sanity/lib/client'
import { homePreviewCardsQuery } from '@/sanity/lib/queries'
import { unstable_noStore as noStore } from 'next/cache'
import MixedPreviewSection from './MixedPreviewSection'
import { mapHomePreviewCardsToProjects } from './project-data'
import type { HomePreviewCardDocument } from './project-types'

// Blocchetto "preview" della home:
// prende le card editoriali dedicate e le prepara per la masonry.
export default async function HomeProjectsPreview() {
    noStore()

    const cards: HomePreviewCardDocument[] = await client.fetch(homePreviewCardsQuery)
    const projectsWithMedia = mapHomePreviewCardsToProjects(cards)

    return (
        <MixedPreviewSection
            projects={projectsWithMedia}
            sectionId="preview"
        />
    )
}
