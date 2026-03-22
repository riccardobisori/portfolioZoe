import ProjectDetailLayout from '@/app/components/ProjectDetailLayout'
import { client } from '@/sanity/lib/client'
import { projectBySlugQuery } from '@/sanity/lib/queries'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound, redirect } from 'next/navigation'

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    noStore()

    const { slug } = await params
    const project = await client.fetch(projectBySlugQuery, { slug })

    if (!project) notFound()
    if (project.kind !== 'series') redirect(`/works/${project.slug.current}`)

    return <ProjectDetailLayout project={project} />
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    noStore()

    const { slug } = await params
    const project = await client.fetch(projectBySlugQuery, { slug })
    return {
        title: `${project?.title} — Ginevra Zoe Giannelli`,
        description: project?.description ?? 'Serie fotografica di Ginevra Zoe Giannelli',
    }
}
