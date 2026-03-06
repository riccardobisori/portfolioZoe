// Componente puramente decorativo — nessuna interazione utente
// quindi non serve 'use client', gira sul server (più performante)

// Definiamo i testi che scorrono come array di stringhe
// In futuro potrebbero venire dal CMS (Sanity) dinamicamente
const items = [
    'Fashion',
    'Street',
    'Nature',
    'Portrait',
    'Concettuale',
    'Firenze',
]

export default function Marquee() {
    return (
        // Wrapper esterno: nasconde il contenuto che "esce" dai bordi
        // I bordi sopra e sotto danno un look editoriale
        <div style={{
            overflow: 'hidden',
            borderTop: '1px solid rgba(26,24,20,0.1)',
            borderBottom: '1px solid rgba(26,24,20,0.1)',
            padding: '1rem 0',
            background: 'var(--paper)',
        }}>
            {/*
          Il trucco del marquee infinito:
          duplichiamo gli item due volte nello stesso div.
          L'animazione CSS sposta il div del 50% verso sinistra,
          quando la prima metà è uscita, la seconda è identica
          quindi sembra un loop infinito senza salti.
        */}
            <div style={{
                display: 'flex',
                whiteSpace: 'nowrap',   // impedisce agli item di andare a capo
                // 'marquee' è l'animazione definita in globals.css
                // 20s = velocità, linear = velocità costante, infinite = loop
                animation: 'marquee 20s linear infinite',
            }}>
                {/* Prima copia degli item */}
                {items.map((item) => (
                    // key è obbligatorio in React quando si renderizza una lista
                    // serve a React per identificare ogni elemento in modo univoco
                    // (come una primary key in un DB)
                    <span key={`a-${item}`} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}>
                        {/* Testo dell'item */}
                        <span style={{
                            fontSize: '0.6rem',
                            letterSpacing: '0.4em',
                            textTransform: 'uppercase',
                            color: 'var(--dust)',
                            padding: '0 3rem',
                        }}>
                            {item}
                        </span>
                        {/* Separatore decorativo tra gli item */}
                        <span style={{
                            color: 'var(--accent)',
                            padding: '0 1rem',
                            fontSize: '0.6rem',
                        }}>
                            —
                        </span>
                    </span>
                ))}

                {/* Seconda copia identica — necessaria per il loop infinito */}
                {items.map((item) => (
                    <span key={`b-${item}`} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}>
                        <span style={{
                            fontSize: '0.6rem',
                            letterSpacing: '0.4em',
                            textTransform: 'uppercase',
                            color: 'var(--dust)',
                            padding: '0 3rem',
                        }}>
                            {item}
                        </span>
                        <span style={{
                            color: 'var(--accent)',
                            padding: '0 1rem',
                            fontSize: '0.6rem',
                        }}>
                            —
                        </span>
                    </span>
                ))}
            </div>
        </div>
    )
}