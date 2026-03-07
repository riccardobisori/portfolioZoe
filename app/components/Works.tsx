// Rimuoviamo 'use client' dal componente principale —
// la fetch dei dati avviene sul server (Server Component)
// Solo HoverOverlay e WorkCard rimangono client-side

import { client } from '@/sanity/lib/client'
import { featuredWorksQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import WorksClient from './WorksClient'

// Definiamo il tipo TypeScript per i dati che arrivano da Sanity
export interface SanityWork {
    _id: string
    title: string
    slug: { current: string }
    year: string
    mainImage: any   // il tipo immagine di Sanity è complesso — usiamo any per ora
    category: {
        title: string
        slug: { current: string }
    }
}

// Works è un Server Component — fa la fetch direttamente sul server
// Non serve useEffect o useState per i dati — Next.js gestisce tutto
export default async function Works() {
    // fetch dei dati da Sanity — come chiamare un repository in Spring
    // async/await funziona direttamente nei Server Component
    const works: SanityWork[] = await client.fetch(featuredWorksQuery)

    // Trasformiamo i dati Sanity aggiungendo l'URL dell'immagine
    const worksWithUrls = works.map(work => ({
        ...work,  // spread operator — copia tutte le proprietà esistenti
        imageUrl: work.mainImage
            ? urlFor(work.mainImage).width(800).height(1000).url()
            : null,  // se non c'è immagine, null
    }))

    return <WorksClient works={worksWithUrls} />
}