'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { urlFor } from '@/sanity/lib/image'

interface HeroProps {
    heroImage: unknown | null
}

export default function Hero({ heroImage }: HeroProps) {
    const [expandProgress, setExpandProgress] = useState(0)
    const [scrollUnlocked, setScrollUnlocked] = useState(false)
    const progressRef = useRef(0) // valore visualizzato
    const targetRef = useRef(0) // valore target verso cui interpoliamo

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
        if (!scrollUnlocked) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = previous
        }
    }, [scrollUnlocked])

    // Costruiamo l'URL dell'immagine se esiste
    // width(1920) = risoluzione massima per schermi grandi
    // quality(90) = qualità alta ma non massima, bilancia peso e qualità
    const imageUrl = heroImage
        ? urlFor(heroImage).width(1920).height(1080).quality(90).url()
        : null

    const showArrow = expandProgress >= 0.985
    const revealProgress = showArrow ? 1 : expandProgress
    const curtainWidth = `${50 - revealProgress * 50}%`
    const titleTranslateX = `translateX(calc(-${revealProgress.toFixed(4)} * (100vw - (2 * clamp(2rem, 6vw, 5rem)) - min(46vw, 560px))))`

    return (
        <section
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
                background: '#fff',
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
                alignItems: 'flex-end',
                padding: 'clamp(2rem, 6vw, 5rem)',
                paddingBottom: 'clamp(3rem, 8vw, 6rem)',
                pointerEvents: 'none',
                transform: titleTranslateX,
                willChange: 'transform',
            }}>
                <p style={{
                    fontSize: '0.58rem',
                    letterSpacing: '0.45em',
                    textTransform: 'uppercase',
                    color: 'var(--ink)',
                    marginBottom: '1.25rem',
                    animation: 'fadeUp 1s ease 1s forwards',
                    textAlign: 'right',
                    width: 'min(46vw, 560px)',
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
                    textAlign: 'right',
                    margin: 0,
                    width: 'min(46vw, 560px)',
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

                <div
                    className="hidden md:block"
                    style={{
                        width: 'calc(100vw - clamp(4rem, 12vw, 10rem))',
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
                onClick={() => setScrollUnlocked(true)}
                style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 'clamp(1.25rem, 3vh, 2.5rem)',
                    transform: 'translateX(-50%)',
                    width: '54px',
                    height: '54px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.85)',
                    color: '#fff',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.55rem',
                    lineHeight: 1,
                    opacity: showArrow ? 1 : 0,
                    pointerEvents: showArrow ? 'auto' : 'none',
                    transition: 'opacity 0.35s ease',
                    zIndex: 6,
                    background: 'rgba(0,0,0,0.28)',
                    backdropFilter: 'blur(2px)',
                }}
            >
                ↓
            </Link>
        </section>
    )
}
