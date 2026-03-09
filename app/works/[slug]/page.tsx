import { client } from '@/sanity/lib/client'
import { workBySlugQuery } from '@/sanity/lib/queries'

// In Next.js 15 params è una Promise — va awaittato prima di usarlo
export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const work = await client.fetch(workBySlugQuery, { slug })

    if (!work) return <div>Lavoro non trovato</div>

    return (
        <main>
            <h1>{work.title}</h1>
            {/* il design viene dopo */}
        </main>
    )
}

// generateMetadata — stesso fix: params va awaittato
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const work = await client.fetch(workBySlugQuery, { slug })
    return {
        title: `${work?.title} — Ginevra Zoe Giannelli`,
        description: work?.description ?? 'Lavoro fotografico di Ginevra Zoe Giannelli',
    }
}
