import Image from 'next/image'
import Nav from '@/app/components/Nav'
import { urlFor } from '@/sanity/lib/image'

interface SanityImageAsset {
  _ref?: string
}

interface SanityImage {
  asset?: SanityImageAsset
}

interface ProjectDetailLayoutProps {
  project: {
    title: string
    description?: string | null
    gallery?: SanityImage[] | null
  }
}

interface GalleryImageItem {
  id: string
  image: SanityImage
  width: number
  height: number
  ratio: number
  url: string
  layout: 'fullBleed' | 'column' | 'centeredPortrait'
}

// Estrae width/height dall'asset ref di Sanity per guidare il layout senza fetch extra.
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

// Normalizza la gallery in item pronti al render e assegna il layout in base al ratio.
function mapGalleryImages(gallery?: SanityImage[] | null): GalleryImageItem[] {
  const validImages = (gallery ?? []).flatMap((image, index) => {
    const dimensions = getImageDimensions(image)
    if (!dimensions) return []

    // I tagli più estremi meritano un trattamento dedicato per non sembrare compressi nella griglia.
    const isLandscape = dimensions.ratio > 1.24
    const isTallPortrait = dimensions.ratio < 0.72
    const layout: GalleryImageItem['layout'] = isLandscape
      ? 'fullBleed'
      : isTallPortrait
        ? 'centeredPortrait'
        : 'column'

    return [
      {
        id: `${image.asset?._ref ?? 'gallery'}-${index}`,
        image,
        width: dimensions.width,
        height: dimensions.height,
        ratio: dimensions.ratio,
        url: urlFor(image).width(2200).quality(88).auto('format').url(),
        layout,
      },
    ]
  })

  return validImages.map((item, index, items) => {
    if (item.layout !== 'centeredPortrait') return item

    // Evitiamo due portrait "hero" consecutivi: il secondo rientra nella colonna standard.
    const previousIsCenteredPortrait = items[index - 1]?.layout === 'centeredPortrait'
    return {
      ...item,
      layout: previousIsCenteredPortrait ? 'column' : 'centeredPortrait',
    }
  })
}

// Renderizza ogni immagine nel frame più adatto, mantenendo separata la variante portrait centrata.
function GalleryImage({ item }: { item: GalleryImageItem }) {
  if (item.layout === 'centeredPortrait') {
    return (
      <figure
        className="project-detail-gallery-figure-centered"
        style={{
          margin: 0,
        }}
      >
        <Image
          src={item.url}
          alt=""
          width={item.width}
          height={item.height}
          sizes="(min-width: 900px) 42vw, 86vw"
          style={{
            width: 'min(100%, 42rem)',
            height: 'auto',
            maxHeight: '92svh',
            display: 'block',
          }}
        />
      </figure>
    )
  }

  return (
    <figure
      className={item.layout === 'fullBleed' ? 'project-detail-gallery-figure-full' : undefined}
      style={{
        margin: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${item.width} / ${item.height}`,
          overflow: 'hidden',
          background: 'rgba(26,24,20,0.06)',
        }}
      >
        <Image
          src={item.url}
          alt=""
          fill
          sizes={
            item.layout === 'fullBleed'
              ? '(min-width: 900px) 96vw, 100vw'
              : '(min-width: 900px) 47vw, 100vw'
          }
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
    </figure>
  )
}

// Compone l'header editoriale del progetto e la gallery con layout adattivo.
export default function ProjectDetailLayout({ project }: ProjectDetailLayoutProps) {
  const galleryItems = mapGalleryImages(project.gallery)

  return (
    <main style={{ cursor: 'none', background: '#fff' }}>
      <Nav />

      <section
        style={{
          minHeight: '52svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
              fontSize: 'clamp(3.9rem, 11vw, 9rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.07em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              fontWeight: 500,
            }}
          >
            {project.title}
          </h1>
          {project.description ? (
            <p
              style={{
                margin: '1.35rem auto 0',
                maxWidth: '38rem',
                fontSize: 'clamp(0.98rem, 1.35vw, 1.08rem)',
                lineHeight: 1.7,
                color: 'rgba(26,24,20,0.7)',
                textWrap: 'balance',
              }}
            >
              {project.description}
            </p>
          ) : null}
        </div>
      </section>

      {galleryItems.length > 0 ? (
        <section
          style={{
            paddingInline: 'clamp(10px, 2vw, 22px)',
            paddingBottom: 'clamp(56px, 8vw, 112px)',
          }}
        >
          <div
            className="project-detail-gallery-grid"
            style={{
              display: 'grid',
              gap: 'clamp(12px, 1.8vw, 24px)',
              alignItems: 'start',
            }}
          >
            {galleryItems.map((item) => (
              <GalleryImage key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
