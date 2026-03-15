'use client'

import Link from 'next/link'
import { useEffect, useState, type MouseEvent } from 'react'

export default function Nav() {
  const navItems = [
    { label: 'Works', href: '/works' },
    { label: 'Series', href: '/series' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]
  const [heroLightPhase, setHeroLightPhase] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const shouldUseLightNav = heroLightPhase && !isPastHero
  const navTextColor = shouldUseLightNav ? '#f7f4ef' : 'var(--ink)'
  const navBorderColor = shouldUseLightNav ? 'rgba(247, 244, 239, 0.42)' : 'rgba(26,24,20,0.2)'
  const mobilePanelBg = 'transparent'
  const mobilePanelBorder = shouldUseLightNav
    ? 'rgba(247, 244, 239, 0.22)'
    : 'rgba(26,24,20,0.16)'

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

  useEffect(() => {
    if (!mobileMenuOpen) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false)

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
          {navItems.map((item) => (
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

        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={mobileMenuOpen}
          className="grid place-items-center md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          style={{
            width: '44px',
            height: '44px',
            border: 0,
            background: 'transparent',
            color: navTextColor,
            padding: 0,
          }}
        >
          <span style={{ position: 'relative', width: '20px', height: '14px', display: 'block' }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: mobileMenuOpen ? '6px' : 0,
              width: '20px',
              height: '1px',
              backgroundColor: 'currentColor',
              transform: mobileMenuOpen ? 'rotate(45deg)' : 'none',
              transition: 'top 0.2s ease, transform 0.2s ease',
            }} />
            <span style={{
              position: 'absolute',
              left: 0,
              top: '6px',
              width: '20px',
              height: '1px',
              backgroundColor: 'currentColor',
              opacity: mobileMenuOpen ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }} />
            <span style={{
              position: 'absolute',
              left: 0,
              top: mobileMenuOpen ? '6px' : '12px',
              width: '20px',
              height: '1px',
              backgroundColor: 'currentColor',
              transform: mobileMenuOpen ? 'rotate(-45deg)' : 'none',
              transition: 'top 0.2s ease, transform 0.2s ease',
            }} />
          </span>
        </button>

      </div>
      <div
        className="md:hidden"
        style={{
          maxHeight: mobileMenuOpen ? '70vh' : 0,
          opacity: mobileMenuOpen ? 1 : 0,
          overflow: 'hidden',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'max-height 0.28s ease, opacity 0.2s ease',
          borderBottom: `1px solid ${mobilePanelBorder}`,
          background: mobilePanelBg,
        }}
      >
        <ul
          className="list-none"
          style={{
            margin: 0,
            padding: '1.2rem max(env(safe-area-inset-right, 0px), clamp(1.25rem, 4vw, 2.2rem)) 1.35rem max(env(safe-area-inset-left, 0px), clamp(1.25rem, 4vw, 2.2rem))',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={(event) => handleSectionClick(event, item.href)}
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: navTextColor,
                  textDecoration: 'none',
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
