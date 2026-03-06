// 'use client' dice a Next.js che questo componente gira nel browser
// (necessario perché usiamo animazioni CSS e interazioni utente)
// Senza questa direttiva, Next.js eseguirebbe il componente solo sul server
'use client'

// Importiamo Link di Next.js per la navigazione interna
import Link from 'next/link'

// Definiamo il componente Hero come funzione che restituisce JSX
// In React, ogni componente è una funzione che descrive un pezzo di UI
export default function Hero() {
    return (
        // min-h-screen = altezza minima 100vh
        // grid grid-cols-1 md:grid-cols-2 = una colonna su mobile, due su desktop
        <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">

            {/* ── COLONNA SINISTRA — testo e titolo ── */}
            {/* justify-end = contenuto in basso, pt-32 su mobile per la nav fixed */}
            <div className="flex flex-col justify-end pt-32 md:pt-0 px-6 md:px-12 pb-16 md:pb-20 relative z-10">

                {/* Piccola etichetta sopra il titolo */}
                <p style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.4em',
                    textTransform: 'uppercase',
                    color: 'var(--dust)',       // usa la variabile CSS definita in globals.css
                    marginBottom: '2rem',
                    // Animazione CSS: parte invisibile e sale dal basso
                    // opacity 0 → 1, translateY 24px → 0
                    opacity: 0,
                    animation: 'fadeUp 1s ease 0.3s forwards', // forwards = mantieni stato finale
                }}>
                    Portfolio — Firenze, Italia
                </p>

                {/* Titolo principale */}
                {/* clamp(min, preferito, max) = dimensione fluida che si adatta allo schermo */}
                <h1 style={{
                    fontFamily: 'var(--font-cormorant)', // serif elegante definito in layout.tsx
                    fontWeight: 300,
                    fontSize: 'clamp(3.5rem, 6vw, 7rem)', // responsive: cresce con la larghezza
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink)',
                    opacity: 0,
                    animation: 'fadeUp 1s ease 0.5s forwards', // ritardo 0.5s — dopo l'eyebrow
                }}>
                    Forme<br />
                    {/* <em> = corsivo semantico — qui usiamo per il contrasto visivo */}
                    <em style={{ fontStyle: 'italic', color: 'var(--dust)' }}>e silenzi</em><br />
                    visivi
                </h1>

                {/* Breve descrizione */}
                <p style={{
                    marginTop: '2.5rem',
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    lineHeight: 2,
                    color: 'var(--dust)',
                    maxWidth: '28ch', // 'ch' = larghezza del carattere '0' — limita a ~28 caratteri
                    opacity: 0,
                    animation: 'fadeUp 1s ease 0.8s forwards',
                }}>
                    Fotografia di moda, strada e natura.<br />
                    Uno sguardo concettuale sul reale.
                </p>

                {/* Call to action — link che scorre verso la sezione Works */}
                {/* Il trattino animato è creato con ::after in CSS puro */}
                <Link
                    href="#works"
                    style={{
                        marginTop: '3.5rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.6rem',
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        color: 'var(--ink)',
                        textDecoration: 'none',
                        opacity: 0,
                        animation: 'fadeUp 1s ease 1s forwards',
                    }}
                >
                    Scopri i lavori
                </Link>
            </div>

            {/* 
                Colonna destra — immagine
                h-64 su mobile = altezza fissa ridotta
                md:h-auto = su desktop occupa tutta l'altezza disponibile
            */}
            <div className="relative overflow-hidden h-64 md:h-auto">
                {/* Wrapper dell'immagine con animazione fadeIn */}
                <div style={{
                    position: 'absolute',
                    inset: 0,               // shorthand per top/right/bottom/left: 0
                    opacity: 0,
                    animation: 'fadeIn 1.5s ease 0.2s forwards',
                }}>
                    {/* 
            Placeholder grigio — verrà sostituito con una vera <img> o 
            il componente <Image> di Next.js quando avremo le foto di Ginevra.
            Il gradiente simula una foto in bianco e nero.
          */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(160deg, #d4cfc8 0%, #b8b0a5 40%, #8a8278 100%)',
                        position: 'relative',
                    }}>
                        {/* Etichetta sovrapposta all'immagine, stile editoriale */}
                        <span style={{
                            position: 'absolute',
                            bottom: '2rem',
                            left: '2rem',
                            fontSize: '0.55rem',
                            letterSpacing: '0.4em',
                            color: 'rgba(255,255,255,0.5)',
                        }}>
                            FASHION / 2024
                        </span>
                    </div>
                </div>
            </div>

            {/* Numero decorativo — nascosto su mobile */}
            <div className="hidden md:block" style={{
                position: 'absolute',
                right: '3rem',
                bottom: '5rem',
                fontFamily: 'var(--font-cormorant)',
                fontSize: '8rem',
                fontWeight: 300,
                // rgba con alpha molto bassa = quasi invisibile, solo un accenno
                color: 'rgba(26,24,20,0.06)',
                lineHeight: 1,
                zIndex: 1,
                pointerEvents: 'none', // non intercetta click del mouse
            }}>
                01
            </div>

        </section>
    )
}