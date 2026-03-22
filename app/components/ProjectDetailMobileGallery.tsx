'use client'

import Image from 'next/image'

interface MobileImage {
  id: string
  url: string
  width: number
  height: number
}

interface ProjectDetailMobileGalleryProps {
  images: MobileImage[]
}

function MobileGalleryImage({
  image,
}: {
  image: MobileImage
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Image
        src={image.url}
        alt=""
        width={image.width}
        height={image.height}
        sizes="100vw"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '84svh',
          display: 'block',
        }}
      />
    </div>
  )
}

export default function ProjectDetailMobileGallery({ images }: ProjectDetailMobileGalleryProps) {
  const mobileFrameGap = 'clamp(12px, 2.6vw, 16px)'

  if (images.length === 0) return null

  return (
    <section className="project-detail-mobile-gallery">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: mobileFrameGap,
          paddingLeft: mobileFrameGap,
          paddingRight: mobileFrameGap,
        }}
      >
        {images.map((image) => (
          <MobileGalleryImage key={image.id} image={image} />
        ))}
      </div>
    </section>
  )
}
