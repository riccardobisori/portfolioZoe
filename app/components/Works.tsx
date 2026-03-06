// 'use client' necessario perché usiamo l'IntersectionObserver
// per animare gli elementi quando entrano nel viewport durante lo scroll
'use client'

import { useEffect, useRef, useState } from 'react'

// ── TIPI ──────────────────────────────────────────────────────────────────
// In TypeScript definiamo la "forma" dei dati con interface — come un POJO in Java
// Questo descrive come sarà fatto ogni singolo lavoro fotografico
interface Work {
    id: number
    title: string        // titolo del lavoro es. "Dissoluzione"
    category: string     // categoria es. "Fashion"
    year: string         // anno es. "2024"
    // gradient è il colore placeholder — sparirà quando avremo le foto vere
    gradient: string
}

// ── DATI ──────────────────────────────────────────────────────────────────
// Array di lavori — per ora dati "hardcoded" (scritti direttamente nel codice)
// In futuro questi dati arriveranno da Sanity via API
const works: Work[] = [
    {
        id: 1,
        title: 'Dissoluzione',
        category: 'Fashion',
        year: '2024',
        gradient: 'linear-gradient(135deg, #c5bdb4, #9e968e)',
    },
    {
        id: 2,
        title: 'Strati',
        category: 'Street',
        year: '2024',
        gradient: 'linear-gradient(135deg, #b8c4c0, #7a8f8a)',
    },
    {
        id: 3,
        title: 'Morfologia',
        category: 'Nature',
        year: '2023',
        gradient: 'linear-gradient(135deg, #d4c9bc, #a8998a)',
    },
    {
        id: 4,
        title: 'Assenza',
        category: 'Portrait',
        year: '2023',
        gradient: 'linear-gradient(145deg, #c0bab2, #8a847c)',
    },
    {
        id: 5,
        title: 'Soglia',
        category: 'Fashion',
        year: '2023',
        gradient: 'linear-gradient(145deg, #b4c0b8, #788c84)',
    },
]

// ── COMPONENTE SINGOLA CARD ────────────────────────────────────────────────
// Componente figlio — riceve i dati di un singolo lavoro tramite props
// Le props in React sono come i parametri di un metodo in Java
function WorkCard({ work, isLarge = false }: { work: Work; isLarge?: boolean }) {
    // useRef crea un riferimento diretto a un elemento del DOM
    // simile a document.getElementById() ma il modo React di farlo
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // useEffect esegue codice dopo che il componente è stato renderizzato nel DOM
        // È il posto giusto per interagire con API del browser come IntersectionObserver

        const el = cardRef.current
        if (!el) return

        // IntersectionObserver notifica quando un elemento entra/esce dal viewport
        // Usiamo questo per triggerare l'animazione di reveal durante lo scroll
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // L'elemento è visibile — aggiungiamo la classe CSS 'visible'
                    // che in globals.css porta opacity a 1 e translateY a 0
                    el.classList.add('visible')
                    // Smettiamo di osservare — l'animazione va fatta solo una volta
                    observer.unobserve(el)
                }
            },
            { threshold: 0.1 } // triggera quando il 10% dell'elemento è visibile
        )

        observer.observe(el)

        // Cleanup — quando il componente viene rimosso dal DOM
        // stoppiamo l'observer per evitare memory leak
        // equivalente a un destroy() o @PreDestroy in Java
        return () => observer.disconnect()
    }, []) // array vuoto = esegui solo al primo render (come @PostConstruct)

    return (
        // ref={cardRef} collega questo div al nostro riferimento useRef
        // 'reveal' è la classe CSS in globals.css che parte con opacity: 0
        <div
            ref={cardRef}
            className="reveal"
            style={{
                // Il primo elemento è più grande — occupa 2 righe nella griglia
                gridRow: isLarge ? 'span 2' : 'span 1',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'none',
            }}
        >
            {/* Contenitore immagine — aspect-ratio mantiene le proporzioni */}
            <div style={{
                width: '100%',
                // Il large non ha aspect-ratio fisso perché si estende per 2 righe
                aspectRatio: isLarge ? 'unset' : '3/4',
                height: isLarge ? '100%' : 'auto',
                position: 'relative',
                overflow: 'hidden',
                minHeight: isLarge ? 'unset' : '260px',
            }}>
                {/* 
          Placeholder colorato — sarà sostituito con:
          <Image src={work.imageUrl} alt={work.title} fill />
          quando integreremo Sanity + Cloudinary
        */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '260px',
                    background: work.gradient,
                    // transition su transform per l'effetto zoom al hover
                    transition: 'transform 0.8s cubic-bezier(0.25,0.1,0.25,1)',
                }}
                    // onMouseEnter e onMouseLeave gestiscono l'hover in React
                    // e.currentTarget è l'elemento su cui è avvenuto l'evento
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.04)'
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
                    }}
                />

                {/* Overlay scuro semitrasparente che appare all'hover */}
                {/* Usiamo un componente separato per gestire lo stato hover */}
                <HoverOverlay />
            </div>

            {/* Info sotto la foto — titolo e metadati */}
            <div style={{
                padding: '1rem 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
            }}>
                <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--ink)',
                }}>
                    {work.title}
                </span>
                <span style={{
                    fontSize: '0.55rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'var(--dust)',
                }}>
                    {work.category} · {work.year}
                </span>
            </div>
        </div>
    )
}

// ── OVERLAY HOVER ──────────────────────────────────────────────────────────
// Componente separato per gestire lo stato hover dell'overlay
// In React lo stato locale si gestisce con useState — come una variabile
// di istanza in Java, ma React ri-renderizza il componente quando cambia
function HoverOverlay() {
    // useState restituisce [valore corrente, funzione per aggiornarlo]
    // è come avere un campo privato con il suo setter in Java
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--ink)',
                // L'opacity cambia in base allo stato hovered
                opacity: hovered ? 0.15 : 0,
                transition: 'opacity 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <span style={{
                fontSize: '0.6rem',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'white',
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.4s ease 0.1s',
            }}>
                Visualizza
            </span>
        </div>
    )
}

// ── COMPONENTE PRINCIPALE ──────────────────────────────────────────────────
export default function Works() {
    // useRef per animare l'header della sezione separatamente
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible')
                    observer.unobserve(el)
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        // id="works" permette alla Nav di scrollare qui con href="#works"
        <section id="works" className="px-6 md:px-12 py-20 md:py-32">

            {/* Header della sezione */}
            <div
                ref={headerRef}
                className="reveal"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '4rem',
                    borderBottom: '1px solid rgba(26,24,20,0.1)',
                    paddingBottom: '1.5rem',
                }}
            >
                <span style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'var(--dust)',
                }}>
                    Selected Works
                </span>

                <h2 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--ink)',
                }}>
                    Ultimi lavori
                </h2>

                <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '0.85rem',
                    color: 'var(--dust)',
                    letterSpacing: '0.1em',
                }}>
                    2023 — 2024
                </span>
            </div>

            {/* 
            Griglia asimmetrica — il primo elemento occupa 2 righe (isLarge)
            grid-template-columns: 1.6fr 1fr 1fr = prima colonna più larga
            */}
            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-6">
                {works.map((work, index) => (
                    // Il primo elemento (index === 0) è quello grande a sinistra
                    <WorkCard
                        key={work.id}
                        work={work}
                        isLarge={index === 0}
                    />
                ))}
            </div>

        </section>
    )
}