'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
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

// Manteniamo in un helper il testo descrittivo usato nell'overlay:
// ci evita di duplicare il fallback e rende più semplice trasformarlo
// in parole animate singolarmente dentro il render.
function getProjectOverlayDescription(project: ProjectWithUrl) {
  return project.description?.trim() || 'Open project details and full photo story.'
}

interface PortfolioMenuImageLinkProps {
  project: ProjectWithUrl
  imageColumn: '1' | '2'
}

function PortfolioMenuImageLink({ project, imageColumn }: PortfolioMenuImageLinkProps) {
  // Su mobile replichiamo il comportamento di MixedPreviewMobileCard:
  // titolo + anno compaiono solo dopo che la card è davvero entrata in viewport.
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [showMobileText, setShowMobileText] = useState(false)
  const overlayDescriptionWords = getProjectOverlayDescription(project).split(/\s+/)

  useEffect(() => {
    const node = cardRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.55 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Timer one-shot allineato a MixedPreviewMobileCard:
    // il testo mobile compare con un piccolo ritardo editoriale, non subito.
    if (showMobileText || !isInView) return
    const timer = window.setTimeout(() => setShowMobileText(true), 1200)
    return () => window.clearTimeout(timer)
  }, [isInView, showMobileText])

  return (
    <Link
      href={getProjectHref(project)}
      aria-label={`Open ${project.title}`}
      className="portfolioImageLink"
      style={{
        display: 'block',
        gridColumn: imageColumn,
        gridRow: 1,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div ref={cardRef} className="portfolioImageCardShell">
        <div
          className="portfolioImageWrap portfolioImageWrapDesktop"
          style={{
            // Desktop: manteniamo il crop quadrato e l'overlay hover descrittivo.
            position: 'relative',
            aspectRatio: '1 / 1',
            overflow: 'hidden',
            background: 'rgba(26,24,20,0.08)',
          }}
        >
          {project.imageUrl && (
            <Image
              className="portfolioImage"
              src={project.imageUrl}
              alt={project.title || 'Project image'}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              style={{
                objectFit: 'cover',
                display: 'block',
              }}
            />
          )}
          <div className="portfolioImageOverlay" aria-hidden="true">
            <div className="portfolioImageOverlayInner">
              <p className="portfolioImageOverlayDescription">
                {overlayDescriptionWords.map((word, wordIndex) => (
                  <span
                    key={`${project._id}-word-${wordIndex}`}
                    className="portfolioImageOverlayWord"
                    style={
                      {
                        // Salviamo il delay in una custom property CSS:
                        // verra usata solo durante l'animazione di entrata, non nel reset.
                        '--word-delay': `${320 + wordIndex * 140}ms`,
                      } as CSSProperties
                    }
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {project.imageUrl && (
          <div className="portfolioImageWrapMobile">
            <img
              src={project.imageUrl}
              alt={project.title}
              style={{
                // Mobile: torniamo a un quadrato perfetto e uniforme per tutte le card.
                // L'immagine riempie il frame con `cover`, quindi il comportamento resta coerente
                // anche quando i file originali hanno orientamenti diversi.
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
              }}
            />
            <div
              className="portfolioMobileMeta"
              style={{
                opacity: showMobileText ? 1 : 0,
                transform: `translateY(${showMobileText ? 0 : 4}px)`,
              }}
            >
              <span className="portfolioMobileMetaTitle">{project.title}</span>
              <span className="portfolioMobileMetaYear">{project.year}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
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
        // Manteniamo solo il respiro finale: l'offset superiore
        // è gestito dall'header con gli stessi valori del detail project.
        width: '100%',
        paddingBottom: 'clamp(56px, 8vw, 112px)',
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
          paddingTop: 'clamp(112px, 14vw, 180px)',
          paddingBottom: 'clamp(44px, 7vw, 72px)',
          paddingInline: 'clamp(16px, 3vw, 28px)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '58rem',
            marginInline: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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
            <div
              key={project._id}
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
              }}
            >
              {(() => {
                // Alterniamo immagine e copy in base all'indice per ottenere
                // un ritmo "zig-zag" senza duplicare il markup delle righe.
                const isImageOnLeft = index % 2 === 0
                const imageColumn = index % 2 === 0 ? '1' : '2'
                const copyColumn = index % 2 === 0 ? '2' : '1'

                return (
                  <>
                    <PortfolioMenuImageLink project={project} imageColumn={imageColumn} />

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
                <div
                  style={{
                    // Titolo e data condividono la stessa riga del copy.
                    // Invertiamo l'ordine in base al lato della foto:
                    // se l'immagine sta a sinistra, la data va a destra del titolo, e viceversa.
                    // Usiamo un centraggio verticale reale invece della baseline:
                    // cosi la data resta a meta del titolo anche quando questo occupa una sola riga.
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: isImageOnLeft ? 'row' : 'row-reverse',
                    gap: 'clamp(14px, 2vw, 26px)',
                    width: 'min(100%, 28rem)',
                  }}
                >
                  <Link
                    href={getProjectHref(project)}
                    className="portfolioTitleLink"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
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
                  </Link>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.64rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(26,24,20,0.5)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')} / {project.year}
                  </p>
                </div>
              </div>
                  </>
                )
              })()}
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        :global(.portfolioImageCardShell) {
          position: relative;
          width: 100%;
        }

        :global(.portfolioImageWrap) {
          /* Crea uno stacking context locale:
             aiuta overlay e immagine a stratificarsi in modo prevedibile. */
          isolation: isolate;
        }

        :global(.portfolioImageWrapMobile) {
          display: none;
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: rgba(26, 24, 20, 0.08);
        }

        :global(.portfolioMobileMeta) {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.9rem;
          pointer-events: none;
          transition:
            opacity 780ms ease-out,
            transform 780ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        :global(.portfolioMobileMetaTitle) {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(247, 244, 239, 0.96);
          line-height: 1.2;
          text-align: center;
        }

        :global(.portfolioMobileMetaYear) {
          font-size: 0.56rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(247, 244, 239, 0.9);
          line-height: 1.2;
          text-align: center;
        }

        :global(.portfolioImage) {
          /* L'immagine ha una transizione propria, separata dal testo:
             questo permette zoom e correzione tonale senza rendere l'overlay "gommoso". */
          transition:
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 700ms cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center center;
        }

        :global(.portfolioImageOverlay) {
          /* Overlay full-bleed ma centrato:
             resta quasi invisibile a riposo e compare con un velo molto leggero
             per non "spegnere" troppo la fotografia durante l'hover. */
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(20px, 4vw, 42px);
          background:
            linear-gradient(180deg, rgba(13, 12, 10, 0.03) 0%, rgba(13, 12, 10, 0.12) 100%);
          opacity: 0;
          transition:
            opacity 420ms ease,
            background 420ms ease;
          pointer-events: none;
        }

        :global(.portfolioImageOverlayInner) {
          /* Il testo è centrato nel fotogramma.
             Usiamo clip-path + lieve blur per un reveal più elegante di un "typewriter" puro,
             che qui rischierebbe di sembrare troppo tecnico rispetto al tono fotografico. */
          max-width: min(30rem, 100%);
          text-align: center;
          transform: translateY(12px) scale(0.985);
          opacity: 0;
          filter: blur(10px);
          clip-path: inset(0 100% 0 0);
          transition:
            /* Reveal più lento con un piccolo delay:
               prima si percepisce il cambio di stato dell'immagine,
               poi la scritta entra con più calma e presenza. */
            transform 1040ms cubic-bezier(0.16, 1, 0.3, 1) 120ms,
            opacity 680ms ease 120ms,
            filter 1040ms cubic-bezier(0.16, 1, 0.3, 1) 120ms,
            clip-path 1220ms cubic-bezier(0.2, 0.8, 0.2, 1) 120ms;
        }

        :global(.portfolioImageOverlayDescription) {
          margin: 0;
          max-width: 26rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.2em 0.32em;
          font-size: clamp(1.05rem, 1.45vw, 1.3rem);
          line-height: 1.55;
          letter-spacing: -0.015em;
          color: rgba(255, 251, 245, 0.98);
          text-shadow: 0 1px 12px rgba(13, 12, 10, 0.18);
        }

        :global(.portfolioImageOverlayWord) {
          /* Stato iniziale di ogni parola:
             resta subito resettabile quando l'hover si interrompe. */
          display: inline-block;
          opacity: 0;
          transform: translateY(0.42em);
          filter: blur(6px);
          will-change: opacity, transform, filter;
        }

        /* Stato attivo sull'immagine:
           - hover reale sul wrapper fotografico
           - focus interno se in futuro si aggiungono elementi focusable
           - focus visibile della riga link per accessibilità tastiera */
        :global(.portfolioImageWrap:hover .portfolioImage),
        :global(.portfolioImageWrap:focus-within .portfolioImage),
        :global(.portfolioRow:focus-visible .portfolioImage) {
          transform: scale(1.02);
          filter: saturate(0.97) contrast(0.99) brightness(0.93);
        }

        /* Fade-in del velo sopra la foto. */
        :global(.portfolioImageWrap:hover .portfolioImageOverlay),
        :global(.portfolioImageWrap:focus-within .portfolioImageOverlay),
        :global(.portfolioRow:focus-visible .portfolioImageOverlay) {
          opacity: 1;
        }

        /* Reveal del testo con movimento e rimozione del blur. */
        :global(.portfolioImageWrap:hover .portfolioImageOverlayInner),
        :global(.portfolioImageWrap:focus-within .portfolioImageOverlayInner),
        :global(.portfolioRow:focus-visible .portfolioImageOverlayInner) {
          transform: translateY(0) scale(1);
          opacity: 1;
          filter: blur(0);
          clip-path: inset(0 0 0 0);
        }

        /* Una volta aperto l'overlay, le singole parole completano il reveal in sequenza. */
        :global(.portfolioImageWrap:hover .portfolioImageOverlayWord),
        :global(.portfolioImageWrap:focus-within .portfolioImageOverlayWord),
        :global(.portfolioRow:focus-visible .portfolioImageOverlayWord) {
          /* L'animazione parte solo nello stato attivo:
             se il mouse esce, le parole tornano subito allo stato iniziale senza delay "sporchi". */
          animation: portfolio-overlay-word-reveal 1280ms cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--word-delay);
        }

        @keyframes portfolio-overlay-word-reveal {
          0% {
            opacity: 0;
            transform: translateY(0.42em);
            filter: blur(6px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @media (max-width: 900px) {
          :global(.portfolioRow) {
            /* Sotto i 900px la composizione alternata smette di essere utile:
               impiliamo immagine e testo in una sola colonna per migliorare scansione e tap targets. */
            grid-template-columns: 1fr !important;
            gap: 18px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          :global(.portfolioImageLink) {
            /* Anche il link che contiene l'immagine deve tornare alla prima colonna:
               altrimenti le card che su desktop stavano a destra si portano dietro
               il vecchio gridColumn: 2 inline e risultano visivamente decentrate. */
            grid-column: 1 !important;
            width: 100%;
          }

          :global(.portfolioImageWrap),
          :global(.portfolioCopyWrap) {
            grid-column: 1;
          }

          :global(.portfolioCopyWrap) {
            /* Su mobile il titolo e la data devono vivere dentro l'immagine
               esattamente come in MixedPreviewMobileCard, quindi nascondiamo il copy laterale. */
            display: none !important;
          }

          :global(.portfolioImageWrapDesktop) {
            display: none;
          }

          :global(.portfolioImageWrapMobile) {
            display: block;
          }

          :global(.portfolioImageOverlay) {
            display: none;
          }

          :global(.portfolioImageOverlayInner) {
            display: none;
          }

          :global(.portfolioImageOverlayWord) {
            animation: none !important;
          }

          :global(.portfolioImage) {
            /* Sul branch mobile mostriamo la versione <img>, quindi il Next/Image desktop non anima. */
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  )
}
