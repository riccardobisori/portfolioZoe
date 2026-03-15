import { client } from '@/sanity/lib/client'
import { workBySlugQuery } from '@/sanity/lib/queries'

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const work = await client.fetch(workBySlugQuery, { slug })

    if (!work) return <div>Serie non trovata</div>

    return (
        <main>
            <h1>{work.title}</h1>
        </main>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const work = await client.fetch(workBySlugQuery, { slug })
    return {
        title: `${work?.title} — Ginevra Zoe Giannelli`,
        description: work?.description ?? 'Serie fotografica di Ginevra Zoe Giannelli',
    }
}
