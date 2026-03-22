import Image from 'next/image'
import Nav from '@/app/components/Nav'
import { urlFor } from '@/sanity/lib/image'
import type { ProjectDetailRow, SanityImage } from './project-types'
import ProjectDetailMobileGallery from './ProjectDetailMobileGallery'

interface ProjectDetailLayoutProps {
  project: {
    title: string
    year?: string | null
    description?: string | null
    gallery?: SanityImage[] | null
    detailLayout?: ProjectDetailRow[] | null
  }
}

interface ImageMedia {
  id: string
  width: number
  height: number
  ratio: number
  url: string
}

interface RenderRow {
  id: string
  layoutType: ProjectDetailRow['layoutType']
  side?: 'left' | 'right'
  text?: string | null
  zoomImage?: ImageMedia | null
  images: ImageMedia[]
}

// Legge le dimensioni originali dal ref Sanity per evitare fetch metadata extra.
function getImageDimensions(image?: SanityImage | null) {
  const imageRef = image?.asset?._ref
  if (!imageRef) return null

  const dimensionsMatch = imageRef.match(/-(\d+)x(\d+)-/)
  if (!dimensionsMatch) return null

  const width = Number.parseInt(dimensionsMatch[1], 10)
  const height = Number.parseInt(dimensionsMatch[2], 10)
  if (!width || !height) return null

  return {
    width,
    height,
    ratio: width / height,
  }
}

// Converte un'immagine Sanity in media pronta al render con URL ottimizzato.
function getImageMedia(image?: SanityImage | null, id = 'image') {
  const dimensions = getImageDimensions(image)
  if (!dimensions || !image) return null

  return {
    id,
    width: dimensions.width,
    height: dimensions.height,
    ratio: dimensions.ratio,
    url: urlFor(image).width(2400).quality(88).auto('format').url(),
  }
}

// Traduce il layout editoriale del CMS in righe renderizzabili e scarta quelle incomplete.
function buildExplicitRows(detailLayout?: ProjectDetailRow[] | null): RenderRow[] {
  return (detailLayout ?? []).flatMap((row, index) => {
    const images = [
      getImageMedia(row.primaryImage, `${row._key ?? index}-primary`),
      getImageMedia(row.secondaryImage, `${row._key ?? index}-secondary`),
      getImageMedia(row.tertiaryImage, `${row._key ?? index}-tertiary`),
      getImageMedia(row.quaternaryImage, `${row._key ?? index}-quaternary`),
    ].filter((image): image is ImageMedia => Boolean(image))

    const minimumImagesByLayout: Record<ProjectDetailRow['layoutType'], number> = {
      singlePortrait: 1,
      doublePortrait: 2,
      fullBleedLandscape: 1,
      quadLandscape: 4,
      portraitWithText: 1,
      portraitWithZoom: 1,
    }

    if (images.length < minimumImagesByLayout[row.layoutType]) return []

    return [
      {
        id: row._key ?? `detail-row-${index}`,
        layoutType: row.layoutType,
        side: row.side ?? 'left',
        text: row.text ?? null,
        zoomImage:
          getImageMedia(row.zoomImage, `${row._key ?? index}-zoom`) ??
          getImageMedia(row.primaryImage, `${row._key ?? index}-zoom-fallback`),
        images,
      },
    ]
  })
}

// Genera una sequenza sensata dalla gallery legacy quando il layout editoriale non esiste.
function buildFallbackRows(gallery?: SanityImage[] | null): RenderRow[] {
  const images = (gallery ?? [])
    .map((image, index) => getImageMedia(image, `gallery-${index}`))
    .filter((image): image is ImageMedia => Boolean(image))

  const portraits = images.filter((image) => image.ratio < 1)
  const landscapes = images.filter((image) => image.ratio >= 1)
  const rows: RenderRow[] = []

  while (portraits.length > 0 || landscapes.length > 0) {
    if (landscapes.length >= 4) {
      rows.push({
        id: `fallback-quad-${rows.length}`,
        layoutType: 'quadLandscape',
        images: landscapes.splice(0, 4),
      })
      continue
    }

    if (portraits.length >= 2) {
      rows.push({
        id: `fallback-double-${rows.length}`,
        layoutType: 'doublePortrait',
        images: portraits.splice(0, 2),
      })
      continue
    }

    if (landscapes.length > 0) {
      rows.push({
        id: `fallback-landscape-${rows.length}`,
        layoutType: 'fullBleedLandscape',
        images: [landscapes.shift()!],
      })
      continue
    }

    rows.push({
      id: `fallback-portrait-${rows.length}`,
      layoutType: 'singlePortrait',
      images: [portraits.shift()!],
    })
  }

  return rows
}

// Renderizza un'immagine preservando il ratio e lasciando ai layout solo i limiti massimi.
function EditorialImage({
  image,
  sizes,
  className,
  maxWidth,
  maxHeight,
}: {
  image: ImageMedia
  sizes: string
  className?: string
  maxWidth?: string
  maxHeight?: string
}) {
  return (
    <Image
      className={className}
      src={image.url}
      alt=""
      width={image.width}
      height={image.height}
      sizes={sizes}
      style={{
        width: 'auto',
        height: 'auto',
        maxWidth: maxWidth ?? '100%',
        maxHeight,
        display: 'block',
        background: 'rgba(26,24,20,0.06)',
      }}
    />
  )
}

// Mostra l'immagine scelta per il riquadro quadrato senza zoom aggiuntivo da CMS.
function ZoomPanel({ image }: { image: ImageMedia }) {
  return (
    <div className="project-detail-zoom-panel">
      <div className="project-detail-zoom-frame">
        <Image
          src={image.url}
          alt=""
          fill
          sizes="(min-width: 900px) 24vw, 72vw"
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  )
}

// Mantiene il pannello testuale volutamente arioso, come pausa tra i blocchi fotografici.
function TextPanel({ text }: { text?: string | null }) {
  return (
    <div className="project-detail-text-panel">
      <p>{text?.trim() || 'Testo editoriale del progetto.'}</p>
    </div>
  )
}

// Seleziona il pattern visuale corretto per ogni riga editoriale.
function renderRow(row: RenderRow) {
  if (row.layoutType === 'singlePortrait') {
    return (
      <section key={row.id} className="project-detail-row project-detail-row-single-portrait">
        <EditorialImage image={row.images[0]} sizes="(min-width: 900px) 46vw, 88vw" maxWidth="min(100%, 47rem)" />
      </section>
    )
  }

  if (row.layoutType === 'doublePortrait') {
    return (
      <section key={row.id} className="project-detail-row project-detail-row-double-portrait">
        {row.images.slice(0, 2).map((image) => (
          <div key={image.id} className="project-detail-column-cell project-detail-column-cell-center">
            <EditorialImage image={image} sizes="(min-width: 900px) 46vw, 88vw" maxWidth="100%" />
          </div>
        ))}
      </section>
    )
  }

  if (row.layoutType === 'fullBleedLandscape') {
    return (
      <section key={row.id} className="project-detail-row project-detail-row-full-bleed">
        <EditorialImage image={row.images[0]} sizes="100vw" maxWidth="min(100%, 140rem)" />
      </section>
    )
  }

  if (row.layoutType === 'quadLandscape') {
    return (
      <section key={row.id} className="project-detail-row project-detail-row-quad">
        <div className="project-detail-quad-column">
          {row.images.slice(0, 2).map((image) => (
            <EditorialImage key={image.id} image={image} sizes="(min-width: 900px) 24vw, 82vw" maxWidth="100%" />
          ))}
        </div>
        <div className="project-detail-quad-column">
          {row.images.slice(2, 4).map((image) => (
            <EditorialImage key={image.id} image={image} sizes="(min-width: 900px) 24vw, 82vw" maxWidth="100%" />
          ))}
        </div>
      </section>
    )
  }

  if (row.layoutType === 'portraitWithText') {
    return (
      <section
        key={row.id}
        className={`project-detail-row project-detail-row-sidecar ${
          row.side === 'right' ? 'project-detail-row-sidecar-reverse' : ''
        }`}
      >
        <div className="project-detail-sidecar-image">
          <EditorialImage image={row.images[0]} sizes="(min-width: 900px) 44vw, 88vw" maxWidth="100%" />
        </div>
        <TextPanel text={row.text} />
      </section>
    )
  }

  return (
    <section
      key={row.id}
      className={`project-detail-row project-detail-row-sidecar ${
        row.side === 'right' ? 'project-detail-row-sidecar-reverse' : ''
      }`}
    >
      <div className="project-detail-sidecar-image">
        <EditorialImage image={row.images[0]} sizes="(min-width: 900px) 44vw, 88vw" maxWidth="100%" />
      </div>
      <ZoomPanel image={row.zoomImage ?? row.images[0]} />
    </section>
  )
}

function buildMobileImages(rows: RenderRow[]) {
  const images: ImageMedia[] = []

  rows.forEach((row) => {
    images.push(...row.images)

    if (row.layoutType === 'portraitWithZoom' && row.zoomImage && row.zoomImage.url !== row.images[0]?.url) {
      images.push(row.zoomImage)
    }
  })

  const seenUrls = new Set<string>()
  return images.filter((image) => {
    if (seenUrls.has(image.url)) return false
    seenUrls.add(image.url)
    return true
  })
}

// Compone hero del progetto e sequenza editoriale, con fallback automatico alla gallery storica.
export default function ProjectDetailLayout({ project }: ProjectDetailLayoutProps) {
  const detailRows = buildExplicitRows(project.detailLayout)
  const rows = detailRows.length > 0 ? detailRows : buildFallbackRows(project.gallery)
  const mobileImages = buildMobileImages(rows)

  return (
    <main className="paper-texture-surface" style={{ cursor: 'none' }}>
      <Nav />

      <section
        style={{
          minHeight: 'clamp(18rem, 52svh, 32rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 'clamp(96px, 22vw, 180px)',
          paddingBottom: 'clamp(28px, 7vw, 72px)',
          paddingInline: 'clamp(12px, 4.5vw, 28px)',
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
              fontSize: 'clamp(2.8rem, 10vw, 9rem)',
              lineHeight: 0.92,
              letterSpacing: 'clamp(-0.05em, -0.5vw, -0.07em)',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              fontWeight: 500,
              textWrap: 'balance',
            }}
          >
            {project.title}
          </h1>
          {project.description ? (
            <p
              style={{
                margin: 'clamp(0.95rem, 4vw, 1.35rem) auto 0',
                maxWidth: 'min(38rem, 100%)',
                fontSize: 'clamp(0.9rem, 3.8vw, 1.08rem)',
                lineHeight: 1.6,
                color: 'rgba(26,24,20,0.7)',
                textWrap: 'balance',
              }}
            >
              {project.description}
            </p>
          ) : null}
        </div>
      </section>

      {mobileImages.length > 0 ? (
        <ProjectDetailMobileGallery images={mobileImages} />
      ) : null}

      {rows.length > 0 ? (
        <section className="project-detail-editorial-gallery">
          {rows.map((row) => renderRow(row))}
        </section>
      ) : null}
    </main>
  )
}
