// Nota: onMouseEnter richiede 'use client'
'use client'

// Definiamo il tipo per ogni categoria
interface Category {
    number: string   // numero decorativo es. "01"
    name: string     // nome es. "Fashion"
    description: string
    href: string     // link alla pagina della serie — per ora '#'
}

// Dati delle categorie — in futuro potrebbero venire da Sanity
const categories: Category[] = [
    {
        number: '01',
        name: 'Fashion',
        description: 'Editoriali, campagne e progetti personali legati all\'universo della moda concettuale.',
        href: '#',
    },
    {
        number: '02',
        name: 'Street',
        description: 'Frammenti urbani. La città come palcoscenico di silenzi e tensioni irrisolte.',
        href: '#',
    },
    {
        number: '03',
        name: 'Natura & Persone',
        description: 'Paesaggi e ritratti che indagano il rapporto tra corpo umano e ambiente naturale.',
        href: '#',
    },
]

// ── COMPONENTE SINGOLA CATEGORIA ──────────────────────────────────────────
function CategoryCard({ category }: { category: Category }) {
    return (
        <div
            style={{
                background: 'var(--cream)',
                padding: '3rem 2.5rem',
                // transition per il cambio colore al hover
                transition: 'background 0.4s ease',
                cursor: 'none',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--paper)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--cream)'
            }}
        >
            {/* Numero decorativo in filigrana — molto grande e quasi invisibile */}
            <div style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '3rem',
                fontWeight: 300,
                color: 'rgba(26,24,20,0.08)', // quasi invisibile — solo accenno
                lineHeight: 1,
                marginBottom: '1.5rem',
            }}>
                {category.number}
            </div>

            {/* Nome della categoria in serif corsivo */}
            <h3 style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.5rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--ink)',
                marginBottom: '0.75rem',
            }}>
                {category.name}
            </h3>

            {/* Descrizione breve */}
            <p style={{
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                lineHeight: 2,
                color: 'var(--dust)',
            }}>
                {category.description}
            </p>

            {/* Link con animazione letterSpacing al hover */}

            <a href={category.href}
                style={{
                    display: 'inline-block',
                    marginTop: '2rem',
                    fontSize: '0.6rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'var(--dust)',
                    textDecoration: 'none',
                    transition: 'letter-spacing 0.3s ease, color 0.3s ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.letterSpacing = '0.45em'
                    e.currentTarget.style.color = 'var(--ink)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.letterSpacing = '0.3em'
                    e.currentTarget.style.color = 'var(--dust)'
                }}
            >
                Esplora →
            </a>
        </div>
    )
}

// ── COMPONENTE PRINCIPALE ──────────────────────────────────────────────────
export default function Categories() {
    return (
        <section id="categories" className="px-6 md:px-12 py-20 md:py-32">

            {/* Header sezione */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '4rem',
                borderBottom: '1px solid rgba(26,24,20,0.1)',
                paddingBottom: '1.5rem',
            }}>
                <span style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'var(--dust)',
                }}>
                    Archivio
                </span>

                <h2 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--ink)',
                }}>
                    Series
                </h2>
            </div>

            {/* 
                Griglia a tre colonne separate da bordi sottili.
                gap: 0 + background sul wrapper + border sul wrapper
                crea l'effetto di linee divisorie tra le card
            */}
            {/* Su mobile una categoria per riga, su desktop tre affiancate */}
            <div
                className="grid grid-cols-1 md:grid-cols-3"
                style={{
                    gap: '1px',
                    background: 'rgba(26,24,20,0.1)',
                    border: '1px solid rgba(26,24,20,0.1)',
                }}
            >
                {categories.map((category) => (
                    <CategoryCard key={category.number} category={category} />
                ))}
            </div>

        </section>
    )
}