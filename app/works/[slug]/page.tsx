import ProjectDetailLayout from '@/app/components/ProjectDetailLayout'
import { client } from '@/sanity/lib/client'
import { projectBySlugQuery } from '@/sanity/lib/queries'

// In Next.js 15 params è una Promise — va awaittato prima di usarlo
export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = await client.fetch(projectBySlugQuery, { slug })

    if (!project) return <div>Lavoro non trovato</div>

    return <ProjectDetailLayout project={project} />
}

// generateMetadata — stesso fix: params va awaittato
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = await client.fetch(projectBySlugQuery, { slug })
    return {
        title: `${project?.title} — Ginevra Zoe Giannelli`,
        description: project?.description ?? 'Lavoro fotografico di Ginevra Zoe Giannelli',
    }
}
