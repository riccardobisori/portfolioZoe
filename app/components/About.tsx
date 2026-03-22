'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface AboutProps {
    aboutImage: unknown | null
}

export default function About({ aboutImage }: AboutProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setMounted(true)
        })

        return () => window.cancelAnimationFrame(frame)
    }, [])

    const imageUrl = aboutImage
        ? urlFor(aboutImage).width(1400).height(1800).fit('crop').quality(86).auto('format').url()
        : null

    return (
        <section
            className="w-full relative flex items-center justify-center overflow-hidden"
            style={{ minHeight: '100vh', padding: '12vh 5vw 10vh' }}
            data-cursor-scope
        >
            <div className="w-full max-w-[1600px] flex flex-col md:flex-row relative z-10">

                {/* Text Section - Left */}
                <div
                    className="w-full md:w-[65%] z-20 flex flex-col justify-center relative pt-24 md:pt-0"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 1.2s ease-out 0.2s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                    }}
                >
                    <p style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.45em',
                        textTransform: 'uppercase',
                        color: 'rgba(26,24,20,0.5)',
                        marginBottom: 'clamp(2rem, 5vw, 4rem)',
                        paddingLeft: 'clamp(0px, 2vw, 2rem)',
                    }}>
                        Ginevra Zoe Giannelli
                    </p>

                    <h1 style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: 'clamp(4.2rem, 10vw, 12rem)',
                        fontWeight: 300,
                        lineHeight: 0.85,
                        color: 'var(--ink)',
                        textTransform: 'lowercase',
                        margin: 0,
                        letterSpacing: '-0.02em',
                        whiteSpace: 'nowrap',
                    }}>
                        Pinoooo<br />
                        <span style={{ fontStyle: 'italic', color: 'var(--dust)', marginLeft: '1.2em' }}>
                            Bruuuuno
                        </span><br />
                        <span style={{ marginLeft: '1.8em' }}>...Luciano</span>
                    </h1>

                    <div className="mt-16 md:mt-24 md:ml-32 max-w-[28rem] relative z-20 bg-transparent px-4 md:px-0">
                        <p style={{
                            fontSize: '0.85rem',
                            letterSpacing: '0.02em',
                            lineHeight: 2.1,
                            color: 'rgba(26,24,20,0.7)',
                        }}>
                            Ginevra Zoe Giannelli, classe ’97, ha studiato Filosofia all’Università di Firenze e
                            lavora come Digital Art Director presso l’indipendent store fiorentino Société
                            Anonyme. La sua passione per la fotografia nasce durante il periodo Covid
                            quando ha iniziato a scattare con una vecchia Minolta del padre.
                            Appassionata di fotografia urbana e di paesaggio, si ritiene costantemente alla
                            ricerca di ampi spazi da ritrarre e nei quali perdersi.
                        </p>

                        <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: '50px', height: '1px', background: 'var(--ink)' }}></div>
                            <span style={{
                                fontSize: '0.6rem',
                                letterSpacing: '0.4em',
                                textTransform: 'uppercase',
                                color: 'var(--ink)',
                            }}>Firenze, IT</span>
                        </div>
                    </div>
                </div>

                {/* Image Section - Right */}
                <div
                    className="absolute right-0 top-[5vh] md:top-1/2 md:-translate-y-1/2 w-[85%] md:w-[48%] h-[55vh] md:h-[85vh] z-0 overflow-hidden"
                    style={{
                        opacity: mounted ? 1 : 0,
                        clipPath: mounted ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                        transition: 'opacity 1.5s ease-out 0.4s, clip-path 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
                    }}
                >
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgba(26,24,20,0.04)',
                        position: 'relative',
                    }}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-60 mix-blend-multiply">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt="Ritratto per la pagina About"
                                    fill
                                    priority
                                    sizes="(min-width: 768px) 48vw, 85vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--dust)' }}>
                                    Portrait Placeholder
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
