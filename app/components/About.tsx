'use client'

import React, { useEffect, useState } from 'react'

export default function About() {
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

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
                        lo sguardo<br />
                        <span style={{ fontStyle: 'italic', color: 'var(--dust)', marginLeft: '1.2em' }}>
                            come atto
                        </span><br />
                        <span style={{ marginLeft: '1.8em' }}>concettuale</span>
                    </h1>

                    <div className="mt-16 md:mt-24 md:ml-32 max-w-[28rem] relative z-20 bg-transparent px-4 md:px-0">
                        <p style={{
                            fontSize: '0.85rem',
                            letterSpacing: '0.02em',
                            lineHeight: 2.1,
                            color: 'rgba(26,24,20,0.7)',
                        }}>
                            Fotografa e titolare di un atelier di moda concettuale a Firenze. 
                            Studio il confine tra la forma e il significato, tra ciò che è manifesto e il non-detto che abita al di fuori dell&apos;inquadratura.
                            <br /><br />
                            Ogni immagine è un&apos;interrogazione.
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
                        <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-multiply">
                            <span style={{ fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--dust)' }}>
                                Portrait Placeholder
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}