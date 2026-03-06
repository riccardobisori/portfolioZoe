'use client'

export default function About() {
    return (
        // id="about" per il link nella Nav
        // display grid diviso in due colonne uguali — immagine e testo
        // Su mobile colonna singola, su desktop due colonne
        <section
            id="about"
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ 
                minHeight: '70vh',
                background: 'var(--ink)', // sfondo scuro — contrasto con il resto del sito
                overflow: 'hidden',
            }}
        >

            {/* ── COLONNA SINISTRA — immagine ── */}
            {/* Immagine — su mobile altezza fissa, su desktop altezza automatica */}
            <div className="relative overflow-hidden h-72 md:h-auto">
                {/*
                    Placeholder scuro — sarà sostituito con un ritratto di Ginevra.
                    Usiamo un gradiente più scuro rispetto agli altri placeholder
                    perché siamo su sfondo ink (quasi nero)
                */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '500px',
                    background: 'linear-gradient(170deg, #3a3530, #1a1814)',
                }} />
            </div>

            {/* ── COLONNA DESTRA — testo ── */}
            {/* Testo — padding ridotto su mobile */}
            <div className="flex flex-col justify-center px-8 py-16 md:px-20 md:py-24">

                {/* Etichetta piccola sopra il titolo — stile editoriale */}
                <p style={{
                    fontSize: '0.55rem',
                    letterSpacing: '0.45em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)', // oro/beige — risalta sullo sfondo scuro
                    marginBottom: '2rem',
                }}>
                    Chi sono
                </p>

                {/* 
                    Titolo principale in serif — font grande e leggero su sfondo scuro
                    crea un effetto editoriale raffinato
                */}
                <h2 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                    fontWeight: 300,
                    lineHeight: 1.35,
                    color: 'var(--cream)', // crema su sfondo scuro — leggibile e elegante
                }}>
                    Lo sguardo come<br />
                    {/* em in corsivo con colore accent — spezza visivamente il titolo */}
                    <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
                        atto concettuale
                    </em>
                </h2>

                {/* Testo biografico — opacity bassa per gerarchia visiva */}
                {/* Il testo è volutamente depotenziato — il titolo deve dominare */}
                <p style={{
                    marginTop: '2.5rem',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    lineHeight: 2.2,
                    // rgba con alpha 0.45 = testo molto tenue sullo sfondo scuro
                    // crea gerarchia: titolo forte, corpo testo discreto
                    color: 'rgba(244,240,235,0.45)',
                    maxWidth: '40ch',
                }}>
                    Ginevra Zoe Giannelli è fotografa e titolare di un atelier
                    di moda concettuale a Firenze. Il suo lavoro esplora il confine
                    tra forma e significato, tra il visibile e ciò che rimane
                    fuori campo. Ogni scatto è un&apos;interrogazione silenziosa.
                </p>
                {/*
                    Nota: &apos; è l'entità HTML per l'apostrofo.
                    In JSX le stringhe con apostrofi vanno escapate così
                    per evitare conflitti con la sintassi JSX
                */}

                {/* Link "Leggi di più" con trattino animato */}
                {/* 
                    Non usiamo Link di Next.js perché /about non esiste ancora.
                    Quando creeremo la pagina about, cambieremo questo in:
                    <Link href="/about">
                */}

                <a href="#"
                    style={{
                        marginTop: '3rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.6rem',
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        color: 'var(--cream)',
                        textDecoration: 'none',
                    }}
                    // Hover: aumenta il gap per dare senso di movimento 
                    onMouseEnter={e => {
                        e.currentTarget.style.gap = '1.5rem'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.gap = '1rem'
                    }}
                >
                    Leggi di più
                    {/* Trattino decorativo — usiamo un semplice span */}
                    <span style={{
                        display: 'block',
                        width: '30px',
                        height: '1px',
                        background: 'var(--accent)',
                    }} />
                </a>

            </div>
        </section >
    )
}