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

    // Trasformiamo i dati Sanity aggiungendo l'URL dell'immagine e se è orizzontale
    const worksWithUrls = works.map(work => {
        let isLandscape = false;

        // Estrarre le dimensioni reali dal _ref di Sanity (es. image-id-2000x3000-jpg)
        if (work.mainImage?.asset?._ref) {
            const ref = work.mainImage.asset._ref;
            const dimensionsMatch = ref.match(/-(\d+)x(\d+)-/);
            if (dimensionsMatch) {
                const originalWidth = parseInt(dimensionsMatch[1], 10);
                const originalHeight = parseInt(dimensionsMatch[2], 10);
                isLandscape = originalWidth > originalHeight;
            }
        }

        return {
            ...work,
            imageUrl: work.mainImage ? urlFor(work.mainImage).width(800).url() : null,
            isLandscape,
        }
    })

    // Separiamo verticali e orizzontali per creare una composizione più armoniosa
    const portraits = worksWithUrls.filter(w => !w.isLandscape);
    const landscapes = worksWithUrls.filter(w => w.isLandscape);

    // Mescoliamo con un rapporto equilibrato: 2 verticali, 1 orizzontale
    const mixedWorks = [];
    while (portraits.length > 0 || landscapes.length > 0) {
        if (portraits.length > 0) mixedWorks.push(portraits.shift());
        if (portraits.length > 0) mixedWorks.push(portraits.shift());
        if (landscapes.length > 0) mixedWorks.push(landscapes.shift());
    }

    // Filtriamo gli eventuali undefined se uno degli array è finito prima dell'altro
    const finalWorks = mixedWorks.filter(w => w !== undefined);

    return <WorksClient works={finalWorks as any} />
}