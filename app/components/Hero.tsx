'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { urlFor } from '@/sanity/lib/image'

interface HeroProps {
    heroImage: unknown | null
}

export default function Hero({ heroImage }: HeroProps) {
    const [expandProgress, setExpandProgress] = useState(0)
    const [scrollUnlocked, setScrollUnlocked] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    const [titleWidth, setTitleWidth] = useState(0)
    // progressRef = valore renderizzato; targetRef = valore verso cui animiamo in modo fluido.
    const progressRef = useRef(0)
    const targetRef = useRef(0)
    const titleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        progressRef.current = expandProgress
    }, [expandProgress])

    useEffect(() => {
        const touchMediaQuery = window.matchMedia('(hover: none), (pointer: coarse)')
        const applyTouchMode = () => {
            const isTouch = touchMediaQuery.matches
            setIsTouchDevice(isTouch)

            if (!isTouch) {
                targetRef.current = 0
                progressRef.current = 0
                setExpandProgress(0)
                setScrollUnlocked(false)
                return
            }

            // Su touch non c'è wheel: partiamo già in stato "sbloccato"
            // per non bloccare la pagina nella Hero.
            targetRef.current = 1
            progressRef.current = 1
            setExpandProgress(1)
            setScrollUnlocked(true)
        }

        applyTouchMode()
        touchMediaQuery.addEventListener('change', applyTouchMode)

        return () => touchMediaQuery.removeEventListener('change', applyTouchMode)
    }, [])

    useEffect(() => {
        if (isTouchDevice) return

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
    }, [isTouchDevice, scrollUnlocked])

    useEffect(() => {
        if (isTouchDevice) return

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
    }, [isTouchDevice])

    useEffect(() => {
        const previous = document.body.style.overflow
        // Su mobile lo scroll è sempre libero. Il lock vale solo desktop.
        if (isTouchDevice) {
            document.body.style.overflow = ''
        } else if (!scrollUnlocked) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = previous
        }
    }, [isTouchDevice, scrollUnlocked])

    useLayoutEffect(() => {
        if (!titleRef.current) return
        setTitleWidth(titleRef.current.getBoundingClientRect().width)
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

    const showArrow = !isTouchDevice && expandProgress >= 0.985

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent('hero-light-phase', { detail: showArrow })
        )
    }, [showArrow])

    const revealProgress = showArrow ? 1 : expandProgress
    const curtainWidth = `${50 - revealProgress * 50}%`
    const progressValue = revealProgress.toFixed(4)
    const heroTextColor = showArrow ? 'rgb(247, 244, 239)' : 'var(--ink)'
    const titleRuleColor = showArrow ? 'rgba(247, 244, 239, 0.42)' : 'rgba(26,24,20,0.2)'
    // Inset laterale allineato alla stessa gabbia visiva della riga orizzontale.
    const titleEdgeMargin = isTouchDevice ? 'clamp(1rem, 5vw, 1.5rem)' : 'clamp(2rem, 6vw, 5rem)'
    const resolvedTitleWidth = isTouchDevice
        ? 'min(82vw, 420px)'
        : titleWidth > 0
            ? `${titleWidth}px`
            : 'min(46vw, 560px)'
    // Sposta il blocco titolo da destra a sinistra mantenendo margini simmetrici.
    const titleLeft = isTouchDevice
        ? titleEdgeMargin
        : `calc((1 - ${progressValue}) * (100vw - ${titleEdgeMargin} - ${resolvedTitleWidth}) + ${progressValue} * ${titleEdgeMargin})`
    const lockTitleOnRight = !isTouchDevice && titleWidth === 0 && revealProgress < 0.02
    const handleArrowClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        setScrollUnlocked(true)

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                document.getElementById('preview')?.scrollIntoView({
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
                height: isTouchDevice ? '100svh' : '100vh',
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
            }} className="hidden md:block" />

            {/* Contenuto testuale sopra tutto: resta sempre sopra anche durante espansione */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 'clamp(1rem, 1vw, 3rem)',
                paddingBottom: isTouchDevice
                    ? 'calc(clamp(1.25rem, 5vw, 2rem) + env(safe-area-inset-bottom, 0px))'
                    : 'clamp(3rem, 8vw, 6rem)',
                pointerEvents: 'auto',
            }}>
                <div
                    ref={titleRef}
                    style={{
                        position: 'absolute',
                        left: lockTitleOnRight ? 'auto' : titleLeft,
                        right: lockTitleOnRight ? titleEdgeMargin : 'auto',
                        bottom: isTouchDevice
                            ? 'calc(clamp(3.8rem, 9vw, 4.8rem) + env(safe-area-inset-bottom, 0px))'
                            : 'clamp(3rem, 8vw, 6rem)',
                        width: isTouchDevice ? resolvedTitleWidth : 'fit-content',
                        willChange: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isTouchDevice ? 'flex-start' : 'center',
                        color: heroTextColor,
                        transition: 'color 2800ms cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: showArrow ? '220ms' : '0ms',
                        WebkitFontSmoothing: 'antialiased',
                    }}
                >
                    <p style={{
                        fontSize: isTouchDevice ? '0.56rem' : '0.58rem',
                        letterSpacing: isTouchDevice ? '0.28em' : '0.45em',
                        textTransform: 'uppercase',
                        color: 'inherit',
                        marginBottom: isTouchDevice ? '0.95rem' : '1.25rem',
                        textAlign: 'left',
                        width: '100%',
                    }}>
                        Ginevra Zoe Giannelli
                    </p>

                    <h1 style={{
                        fontSize: isTouchDevice
                            ? 'clamp(2.2rem, 13vw, 3.6rem)'
                            : 'clamp(3.5rem, 6vw, 7rem)',
                        fontWeight: 400,
                        letterSpacing: isTouchDevice ? '0.03em' : '0.05em',
                        lineHeight: isTouchDevice ? 1 : 1.05,
                        color: 'inherit',
                        textTransform: 'uppercase',
                        textAlign: isTouchDevice ? 'left' : 'center',
                        margin: 0,
                        width: '100%',
                    }}>
                        Visual<br />
                        <span style={{
                            fontWeight: 400,
                            letterSpacing: '0.003em',
                            color: 'inherit',
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
                        background: titleRuleColor,
                        transition: 'background-color 2800ms cubic-bezier(0.16, 1, 0.3, 1)',
                        zIndex: 2,
                        marginTop: '0.6rem',
                        opacity: '1',
                    }}
                />
            </div>

            {/* Freccia: compare solo quando l'immagine ha riempito tutto */}
            <Link
                href="#preview"
                aria-label="Vai alla sezione successiva"
                onClick={handleArrowClick}
                style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: isTouchDevice
                        ? 'calc(0.75rem + env(safe-area-inset-bottom, 0px))'
                        : 'clamp(1.25rem, 3vh, 2.5rem)',
                    transform: 'translateX(-50%)',
                    width: isTouchDevice ? '56px' : '66px',
                    height: isTouchDevice ? '56px' : '66px',
                    border: 0,
                    color: 'rgba(255,255,255,0.9)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isTouchDevice ? '2rem' : '2.45rem',
                    lineHeight: 1,
                    opacity: showArrow ? 1 : 0,
                    pointerEvents: showArrow ? 'auto' : 'none',
                    transition: 'opacity 0.35s ease',
                    transitionDelay: showArrow ? '260ms' : '0ms',
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
