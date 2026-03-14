'use client'

import Link from 'next/link'
import { useEffect, useState, type MouseEvent } from 'react'

export default function Nav() {
  const [heroLightPhase, setHeroLightPhase] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const shouldUseLightNav = heroLightPhase && !isPastHero
  const navTextColor = shouldUseLightNav ? '#f7f4ef' : 'var(--ink)'
  const navBorderColor = shouldUseLightNav ? 'rgba(247, 244, 239, 0.42)' : 'rgba(26,24,20,0.2)'

  useEffect(() => {
    const handleHeroLightPhase = (event: Event) => {
      const lightPhase = (event as CustomEvent<boolean>).detail
      if (typeof lightPhase !== 'boolean') return
      setHeroLightPhase(lightPhase)
    }

    window.addEventListener('hero-light-phase', handleHeroLightPhase)

    return () => {
      window.removeEventListener('hero-light-phase', handleHeroLightPhase)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Quando usciamo dalla Hero, riportiamo il testo nav su colore scuro.
      setIsPastHero(window.scrollY > window.innerHeight * 0.88)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return

    const targetId = href.slice(1)
    const target = document.getElementById(targetId)
    if (!target) return

    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}`
    )
  }

  return (
    <nav
      data-cursor-scope
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        borderBottom: `1px solid ${navBorderColor}`,
        transition: 'border-color 2800ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: shouldUseLightNav ? '220ms' : '0ms',
      }}
    >
      <div
        className="flex items-center justify-between py-4 md:py-8"
        style={{
          paddingLeft: 'max(env(safe-area-inset-left, 0px), clamp(0.35rem, 1.2vw, 0.9rem))',
          paddingRight: 'max(env(safe-area-inset-right, 0px), clamp(1.25rem, 4vw, 3.25rem))',
        }}
      >

        {/* Logo — solo iniziali, bold, display font */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: navTextColor,
            transition: 'color 2800ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            GZG
          </span>
        </Link>

        {/* Link di navigazione — bianchi su hero scuro */}
        <ul className="hidden md:flex gap-10 list-none">
          {[
            { label: 'Works', href: '/works' },
            { label: 'About', href: '#about' },
            { label: 'Series', href: '#categories' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={(event) => handleSectionClick(event, item.href)}
                style={{
                  fontSize: '0.58rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: navTextColor,
                  textDecoration: 'none',
                  transition: 'color 2800ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex md:hidden items-center gap-5 list-none">
          {[
            { label: 'Works', href: '/works' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={(event) => handleSectionClick(event, item.href)}
                style={{
                  fontSize: '0.54rem',
                  fontWeight: 500,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: navTextColor,
                  textDecoration: 'none',
                  transition: 'color 2800ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  )
}
