'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { ProjectWithUrl } from './project-types'

interface PortfolioMenuSectionProps {
  projects: ProjectWithUrl[]
  sectionId: string
  headingText: string
  introText: string
  emptyText: string
}

// Manteniamo la costruzione dell'href in un helper dedicato:
// il menu mescola "works" e "series", ma il resto del componente
// deve poter renderizzare ogni card in modo uniforme.
function getProjectHref(project: ProjectWithUrl) {
  const isSeries = project.kind === 'series'
  return isSeries ? `/series/${project.slug.current}` : `/works/${project.slug.current}`
}

export default function PortfolioMenuSection({
  projects,
  sectionId,
  headingText,
  introText,
  emptyText,
}: PortfolioMenuSectionProps) {
  return (
    <section
      id={sectionId}
      data-cursor-scope
      style={{
        // La sezione occupa tutta la larghezza disponibile.
        // Gli spazi verticali sono fluidi per mantenere respiro
        // sia su viewport grandi sia su laptop più compatti.
        width: '100%',
        paddingTop: 'clamp(96px, 10vw, 144px)',
        paddingBottom: 'clamp(56px, 8vw, 112px)',
        background: '#f5f1ea',
      }}
    >
      <header
        style={{
          // L'header funziona come introduzione editoriale:
          // tenerlo alto e centrato separa chiaramente il titolo
          // dalla lista dei progetti sottostante.
          minHeight: '52svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'clamp(28px, 5vw, 56px)',
          padding: '0 clamp(16px, 3vw, 28px)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '58rem' }}>
          <p
            style={{
              margin: 0,
              marginBottom: '0.95rem',
              fontSize: '0.7rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(26,24,20,0.52)',
            }}
          >
            Menu
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(4rem, 12vw, 9.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.07em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              fontWeight: 500,
            }}
          >
            {headingText}
          </h1>
          <p
            style={{
              margin: '1.2rem auto 0',
              maxWidth: '34rem',
              fontSize: 'clamp(0.95rem, 1.3vw, 1.08rem)',
              lineHeight: 1.6,
              color: 'rgba(26,24,20,0.68)',
            }}
          >
            {introText}
          </p>
        </div>
      </header>

      {projects.length === 0 ? (
        // Fallback esplicito: se Sanity o la sorgente dati non restituiscono progetti,
        // manteniamo comunque la struttura della sezione con un messaggio leggibile.
        <p
          style={{
            margin: 0,
            padding: '0 clamp(16px, 3vw, 28px)',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            color: 'rgba(26,24,20,0.66)',
          }}
        >
          {emptyText}
        </p>
      ) : (
        <div
          style={{
            // Ogni progetto è una "riga" indipendente.
            // Il gap verticale ampio fa percepire ogni blocco come un capitolo,
            // non come una lista fitta di card tradizionali.
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(44px, 8vw, 110px)',
          }}
        >
          {projects.map((project, index) => (
            <Link
              key={project._id}
              href={getProjectHref(project)}
              className="portfolioRow"
              style={{
                // Due colonne identiche: in questo modo l'immagine resta
                // della stessa larghezza sia quando appare a sinistra sia a destra.
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 'clamp(16px, 3vw, 38px)',
                alignItems: 'center',
                paddingLeft: 'clamp(10px, 1.8vw, 22px)',
                paddingRight: 'clamp(10px, 1.8vw, 22px)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {(() => {
                // Alterniamo immagine e copy in base all'indice per ottenere
                // un ritmo "zig-zag" senza duplicare il markup delle righe.
                const imageColumn = index % 2 === 0 ? '1' : '2'
                const copyColumn = index % 2 === 0 ? '2' : '1'

                return (
                  <>
              <div
                className="portfolioImageWrap"
                style={{
                  // L'immagine resta sempre quadrata per dare coerenza alla griglia.
                  // Se in futuro si cambia il ratio, conviene verificare anche `sizes`
                  // e la resa delle immagini alternate su desktop.
                  gridColumn: imageColumn,
                  gridRow: 1,
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  background: 'rgba(26,24,20,0.08)',
                }}
              >
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title || 'Project image'}
                    fill
                    // Le colonne sono 50/50 su desktop; dichiararlo qui aiuta Next/Image
                    // a scegliere asset più adatti e riduce download inutili.
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    style={{
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                )}
              </div>

              <div
                className="portfolioCopyWrap"
                style={{
                  // Il testo usa la colonna opposta a quella dell'immagine.
                  // `justifyContent: center` tiene il blocco copy più vicino
                  // al centro della riga invece che appoggiato al bordo esterno.
                  gridColumn: copyColumn,
                  gridRow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    marginBottom: '0.7rem',
                    fontSize: '0.64rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,24,20,0.5)',
                  }}
                >
                  {String(index + 1).padStart(2, '0')} / {project.year}
                </p>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: '0.85rem',
                    fontSize: 'clamp(1.9rem, 4vw, 3.15rem)',
                    lineHeight: 0.96,
                    letterSpacing: '-0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {project.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    marginBottom: '0.9rem',
                    // Limite di misura per evitare righe troppo lunghe
                    // quando il viewport è ampio ma la colonna resta vuota attorno.
                    maxWidth: '25rem',
                    fontSize: 'clamp(1rem, 1.35vw, 1.14rem)',
                    lineHeight: 1.7,
                    color: 'rgba(26,24,20,0.7)',
                  }}
                >
                  {project.description?.trim() || 'Open project details and full photo story.'}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.6rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,24,20,0.58)',
                  }}
                >
                  {project.kind === 'series' ? 'Series' : 'Works'} {'\u2192'}
                </p>
              </div>
                  </>
                )
              })()}
            </Link>
          ))}
        </div>
      )}
      <style jsx>{`
        @media (max-width: 900px) {
          .portfolioRow {
            /* Sotto i 900px la composizione alternata smette di essere utile:
               impiliamo immagine e testo in una sola colonna per migliorare scansione e tap targets. */
            grid-template-columns: 1fr !important;
            gap: 18px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .portfolioImageWrap,
          .portfolioCopyWrap {
            grid-column: 1;
          }

          .portfolioCopyWrap {
            /* Sul layout mobile il testo deve partire dal margine sinistro
               invece di restare centrato come nella versione desktop. */
            justify-content: flex-start;
          }
        }
      `}</style>
    </section>
  )
}
