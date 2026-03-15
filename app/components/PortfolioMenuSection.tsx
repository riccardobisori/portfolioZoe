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
        width: '100%',
        paddingTop: 'clamp(84px, 9vw, 126px)',
        paddingBottom: 'clamp(40px, 5vw, 72px)',
        paddingLeft: 'clamp(16px, 4vw, 64px)',
        paddingRight: 'clamp(16px, 4vw, 64px)',
      }}
    >
      <header
        style={{
          marginBottom: 'clamp(24px, 4vw, 44px)',
          maxWidth: '860px',
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: '0.65rem',
            fontSize: '0.58rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(26,24,20,0.58)',
          }}
        >
          Menu
        </p>
        <h1
          style={{
            margin: 0,
            marginBottom: '0.9rem',
            fontSize: 'clamp(1.7rem, 4.2vw, 3.1rem)',
            letterSpacing: '0.03em',
            lineHeight: 1.05,
            textTransform: 'uppercase',
            color: 'var(--ink)',
          }}
        >
          {headingText}
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: '74ch',
            fontSize: 'clamp(0.92rem, 1.2vw, 1.04rem)',
            lineHeight: 1.5,
            color: 'rgba(26,24,20,0.72)',
          }}
        >
          {introText}
        </p>
      </header>

      {projects.length === 0 ? (
        <p
          style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.5,
            color: 'rgba(26,24,20,0.66)',
          }}
        >
          {emptyText}
        </p>
      ) : (
        <div style={{ borderTop: '1px solid rgba(26,24,20,0.16)' }}>
          {projects.map((project, index) => (
            <Link
              key={project._id}
              href={getProjectHref(project)}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(120px, 190px) 1fr',
                gap: 'clamp(0.8rem, 2.2vw, 1.7rem)',
                alignItems: 'start',
                paddingTop: 'clamp(0.9rem, 1.8vw, 1.2rem)',
                paddingBottom: 'clamp(0.9rem, 1.8vw, 1.2rem)',
                borderBottom: '1px solid rgba(26,24,20,0.12)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 5',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: 'rgba(26,24,20,0.08)',
                }}
              >
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title || 'Project image'}
                    fill
                    sizes="(min-width: 1024px) 190px, 36vw"
                    style={{
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                )}
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    marginBottom: '0.48rem',
                    fontSize: '0.56rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,24,20,0.54)',
                  }}
                >
                  {String(index + 1).padStart(2, '0')} / {project.year}
                </p>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    color: 'var(--ink)',
                  }}
                >
                  {project.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    marginBottom: '0.55rem',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    color: 'rgba(26,24,20,0.72)',
                  }}
                >
                  {project.description?.trim() || 'Open project details and full photo story.'}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.54rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,24,20,0.6)',
                  }}
                >
                  {project.kind === 'series' ? 'Series' : 'Works'} {'\u2192'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
