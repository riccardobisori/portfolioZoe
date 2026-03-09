import { client } from '@/sanity/lib/client'
import { workBySlugQuery } from '@/sanity/lib/queries'

// params.slug = il pezzo dell'URL, es. "dissoluzione"
export default async function WorkPage({ params }: { params: { slug: string } }) {
    const work = await client.fetch(workBySlugQuery, { slug: params.slug })

    if (!work) return <div>Lavoro non trovato</div>

    return (
        <main>
            <h1>{work.title}</h1>
            {/* il design viene dopo */}
        </main>
    )
}

// generateMetadata = il metadata SEO dinamico per questa pagina
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const work = await client.fetch(workBySlugQuery, { slug: params.slug })
    return {
        title: `${work?.title} — Ginevra Zoe Giannelli`,
        description: work?.description ?? 'Lavoro fotografico di Ginevra Zoe Giannelli',
    }
}
