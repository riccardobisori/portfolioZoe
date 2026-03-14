'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { urlFor } from '@/sanity/lib/image'

interface HeroProps {
    heroImage: unknown | null
}

export default function Hero({ heroImage }: HeroProps) {
    const [expandProgress, setExpandProgress] = useState(0)
    const [scrollUnlocked, setScrollUnlocked] = useState(false)
    const [titleWidth, setTitleWidth] = useState(0)
    // progressRef = valore renderizzato; targetRef = valore verso cui animiamo in modo fluido.
    const progressRef = useRef(0)
    const targetRef = useRef(0)
    const titleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        progressRef.current = expandProgress
    }, [expandProgress])

    useEffect(() => {
        const SCROLL_TO_PROGRESS = 0.001

        const onWheel = (event: WheelEvent) => {
            if (scrollUnlocked) return

            const current = progressRef.current
            const isAtTop = window.scrollY <= 2
            if (!isAtTop) return

            const scrollingDown = event.deltaY > 0
            const scrollingUp = event.deltaY < 0
            const shouldCapture =
                (scrollingDown && current < 1) ||
                (scrollingUp && current > 0)

            // Quando l'espansione è completa blocchiamo il passaggio alla sezione successiva:
            // si può scendere solo dal bottone freccia.
            if (!shouldCapture && !(scrollingDown && current >= 1)) return

            event.preventDefault()
            // Lo scroll pilota il "target": la RAF sotto si occupa di interpolare in modo morbido.
            targetRef.current = Math.max(
                0,
                Math.min(1, targetRef.current + event.deltaY * SCROLL_TO_PROGRESS)
            )
        }

        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
    }, [scrollUnlocked])

    useEffect(() => {
        let raf = 0

        const animate = () => {
            const current = progressRef.current
            const target = targetRef.current
            // Lerp leggero per evitare scatti nei trackpad/scroll wheel.
            const next = current + (target - current) * 0.12

            if (Math.abs(next - current) > 0.0003) {
                progressRef.current = next
                setExpandProgress(next)
            } else if (Math.abs(target - current) <= 0.0003 && current !== target) {
                progressRef.current = target
                setExpandProgress(target)
            }

            raf = requestAnimationFrame(animate)
        }

        raf = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(raf)
    }, [])

    useEffect(() => {
        const previous = document.body.style.overflow
        // Finché la Hero non è "sbloccata" dalla freccia, blocchiamo lo scroll documento.
        if (!scrollUnlocked) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = previous
        }
    }, [scrollUnlocked])

    useEffect(() => {
        if (!titleRef.current) return
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            setTitleWidth(entry.contentRect.width)
        })
        observer.observe(titleRef.current)
        return () => observer.disconnect()
    }, [])

    // Costruiamo l'URL dell'immagine se esiste
    // width(1920) = risoluzione massima per schermi grandi
    // quality(90) = qualità alta ma non massima, bilancia peso e qualità
    const imageUrl = heroImage
        ? urlFor(heroImage).width(1920).height(1080).quality(90).url()
        : null

    const showArrow = expandProgress >= 0.985
    const revealProgress = showArrow ? 1 : expandProgress
    const curtainWidth = `${50 - revealProgress * 50}%`
    const progressValue = revealProgress.toFixed(4)
    // Inset laterale allineato alla stessa gabbia visiva della riga orizzontale.
    const titleEdgeMargin = 'clamp(2rem, 6vw, 5rem)'
    const resolvedTitleWidth = titleWidth > 0 ? `${titleWidth}px` : 'min(46vw, 560px)'
    // Sposta il blocco titolo da destra a sinistra mantenendo margini simmetrici.
    const titleLeft = `calc((1 - ${progressValue}) * (100vw - ${titleEdgeMargin} - ${resolvedTitleWidth}) + ${progressValue} * ${titleEdgeMargin})`
    const handleArrowClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        setScrollUnlocked(true)

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                document.getElementById('works')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            })
        })

        window.history.replaceState(
            null,
            '',
            `${window.location.pathname}${window.location.search}`
        )
    }

    return (
        <section
            data-cursor-scope
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                background: '#fff',
            }}
        >
            {/* Immagine completa fin da subito: il reveal è fatto dalla "tendina" bianca */}
            {imageUrl ? (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1,
                    }}
                >
                    <Image
                        src={imageUrl}
                        alt="Ginevra Zoe Giannelli"
                        fill
                        priority
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                    />
                </div>
            ) : (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(145deg, #2a2a2a 0%, #111 60%, #000 100%)',
                    zIndex: 1,
                }} />
            )}

            {/* Sipario bianco a destra: si ritira con lo scroll mostrando l'immagine piena */}
            <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: curtainWidth,
                backgroundColor: 'var(--paper-base)',
                backgroundImage:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(243, 236, 226, 0.06) 100%), url('/textures/paper-texture.jpg')",
                backgroundSize: '100% 100%, 420px auto',
                backgroundRepeat: 'no-repeat, repeat',
                zIndex: 2,
                pointerEvents: 'none',
            }} />

            {/* Contenuto testuale sopra tutto: resta sempre sopra anche durante espansione */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 'clamp(1rem, 1vw, 3rem)',
                paddingBottom: 'clamp(3rem, 8vw, 6rem)',
                pointerEvents: 'auto',
            }}>
                <div
                    ref={titleRef}
                    style={{
                        position: 'absolute',
                        left: titleLeft,
                        bottom: 'clamp(3rem, 8vw, 6rem)',
                        width: 'fit-content',
                        willChange: 'left',
                        // Wrapper unico per mantenere nome e titolo sullo stesso asse.
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <p style={{
                        fontSize: '0.58rem',
                        letterSpacing: '0.45em',
                        textTransform: 'uppercase',
                        color: 'var(--ink)',
                        marginBottom: '1.25rem',
                        animation: 'fadeUp 1s ease 1s forwards',
                        // Coerente con il titolo centrato: evita disallineamenti durante la traslazione.
                        textAlign: 'left',
                        width: '100%',
                        mixBlendMode: 'difference',
                    }}>
                        Ginevra Zoe Giannelli
                    </p>

                    <h1 style={{
                        fontSize: 'clamp(3.5rem, 6vw, 7rem)',
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        lineHeight: 1.05,
                        color: 'var(--ink)',
                        textTransform: 'uppercase',
                        // Centrato nel contenitore per mantenere simmetria durante il passaggio dx -> sx.
                        textAlign: 'center',
                        margin: 0,
                        width: '100%',
                        mixBlendMode: 'difference',
                    }}>
                        Visual<br />
                        <span style={{
                            fontWeight: 400,
                            letterSpacing: '0.003em',
                            color: 'var(--ink)',
                        }}>
                            Works
                        </span>
                    </h1>
                </div>

                <div
                    className="hidden md:block"
                    style={{
                        width: 'calc(100vw - clamp(4rem, 12vw, 10rem))',
                        marginInline: 'auto',
                        height: '2px',
                        background: 'rgba(26,24,20,0.2)',
                        animation: 'fadeIn 1s ease 1s forwards',
                        zIndex: 2,
                        marginTop: '0.6rem',
                        opacity: '0',
                        mixBlendMode: 'difference',
                    }}
                />
            </div>

            {/* Freccia: compare solo quando l'immagine ha riempito tutto */}
            <Link
                href="#works"
                aria-label="Vai alla sezione successiva"
                onClick={handleArrowClick}
                style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 'clamp(1.25rem, 3vh, 2.5rem)',
                    transform: 'translateX(-50%)',
                    width: '50px',
                    height: '50px',
                    border: 0,
                    color: 'rgba(255,255,255,0.9)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    lineHeight: 1,
                    opacity: showArrow ? 1 : 0,
                    pointerEvents: showArrow ? 'auto' : 'none',
                    transition: 'opacity 0.35s ease',
                    zIndex: 6,
                    background: 'transparent',
                    animation: showArrow ? 'arrowFloat 1.3s ease-in-out infinite' : 'none',
                }}
            >
                ↓
            </Link>
            <style jsx>{`
                @keyframes arrowFloat {
                    0% {
                        transform: translateX(-50%) translateY(0);
                    }
                    50% {
                        transform: translateX(-50%) translateY(8px);
                    }
                    100% {
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </section>
    )
}
