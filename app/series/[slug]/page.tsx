import { client } from '@/sanity/lib/client'
import { projectBySlugQuery } from '@/sanity/lib/queries'

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = await client.fetch(projectBySlugQuery, { slug })

    if (!project) return <div>Serie non trovata</div>

    return (
        <main>
            <h1>{project.title}</h1>
        </main>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = await client.fetch(projectBySlugQuery, { slug })
    return {
        title: `${project?.title} — Ginevra Zoe Giannelli`,
        description: project?.description ?? 'Serie fotografica di Ginevra Zoe Giannelli',
    }
}
