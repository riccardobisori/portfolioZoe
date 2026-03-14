'use client'

import { useEffect, useRef } from 'react'

const CLICKABLE_SELECTOR =
    'a, button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]'

export default function Cursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const trailRef = useRef<HTMLDivElement>(null)
    const hintRef = useRef<HTMLDivElement>(null)
    const targetRef = useRef({ x: 0, y: 0 })
    const currentRef = useRef({ x: 0, y: 0 })
    const trailCurrentRef = useRef({ x: 0, y: 0 })
    const hoveredRef = useRef<boolean | null>(null)
    const visibleRef = useRef(false)
    const rafRef = useRef<number>(0)

    useEffect(() => {
        const setCustomCursorVisible = (isVisible: boolean) => {
            visibleRef.current = isVisible
            if (cursorRef.current) {
                cursorRef.current.style.opacity = isVisible ? '1' : '0'
            }
            if (trailRef.current) {
                if (!isVisible) {
                    trailRef.current.style.opacity = '0'
                    return
                }
                trailRef.current.style.opacity = hoveredRef.current ? '0.9' : '0.7'
            }
        }

        const onMouseMove = (e: MouseEvent) => {
            targetRef.current = { x: e.clientX, y: e.clientY }
            if (!visibleRef.current) setCustomCursorVisible(true)
        }

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target instanceof Element ? e.target : null
            const isInHomeScope = !!target?.closest('[data-cursor-scope]')
            const isHoveringClickable =
                isInHomeScope && !!target?.closest(CLICKABLE_SELECTOR)
            if (hoveredRef.current === isHoveringClickable) return

            hoveredRef.current = isHoveringClickable
            if (cursorRef.current) {
                cursorRef.current.style.transform = isHoveringClickable
                    ? 'translate(-50%, -50%) scale(1.65)'
                    : 'translate(-50%, -50%) scale(1)'
                cursorRef.current.style.borderRadius = isHoveringClickable ? '4px' : '0'
                cursorRef.current.style.boxShadow = isHoveringClickable
                    ? '0 0 0 1.5px rgba(255,255,255,0.9) inset'
                    : 'none'
            }
            if (trailRef.current) {
                trailRef.current.style.transform = isHoveringClickable
                    ? 'translate(-50%, -50%) scale(1.9)'
                    : 'translate(-50%, -50%) scale(1)'
                trailRef.current.style.borderRadius = isHoveringClickable ? '5px' : '0'
                trailRef.current.style.opacity = isHoveringClickable ? '0.9' : '0.7'
            }
            if (hintRef.current) {
                hintRef.current.style.opacity = isHoveringClickable ? '1' : '0'
                hintRef.current.style.transform = isHoveringClickable
                    ? 'scale(1)'
                    : 'scale(0.6)'
            }
        }

        const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount

        const onDocumentMouseLeave = () => setCustomCursorVisible(false)
        const onDocumentMouseEnter = () => setCustomCursorVisible(true)
        const onWindowBlur = () => setCustomCursorVisible(false)

        const tick = () => {
            const cursor = cursorRef.current
            const trail = trailRef.current
            if (cursor && trail) {
                currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.14)
                currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.14)
                trailCurrentRef.current.x = lerp(trailCurrentRef.current.x, targetRef.current.x, 0.09)
                trailCurrentRef.current.y = lerp(trailCurrentRef.current.y, targetRef.current.y, 0.09)

                cursor.style.left = `${currentRef.current.x}px`
                cursor.style.top = `${currentRef.current.y}px`
                trail.style.left = `${trailCurrentRef.current.x}px`
                trail.style.top = `${trailCurrentRef.current.y}px`
            }
            rafRef.current = requestAnimationFrame(tick)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('blur', onWindowBlur)
        document.addEventListener('mouseover', onMouseOver)
        document.addEventListener('mouseleave', onDocumentMouseLeave)
        document.addEventListener('mouseenter', onDocumentMouseEnter)
        rafRef.current = requestAnimationFrame(tick)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('blur', onWindowBlur)
            document.removeEventListener('mouseover', onMouseOver)
            document.removeEventListener('mouseleave', onDocumentMouseLeave)
            document.removeEventListener('mouseenter', onDocumentMouseEnter)
            cancelAnimationFrame(rafRef.current)
        }
    }, [])

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null
    }

    return (
        <>
            <div
                ref={trailRef}
                style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '0',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                    zIndex: 9998,
                    mixBlendMode: 'difference',
                    border: '1px solid #fff',
                    transform: 'translate(-50%, -50%) scale(1)',
                    transition: 'transform 240ms ease-out, opacity 160ms ease-out, border-radius 220ms ease-out',
                    willChange: 'left, top, transform',
                    opacity: 0,
                }}
            />
        <div
            ref={cursorRef}
            style={{
                width: '18px',
                height: '18px',
                borderRadius: '0',
                position: 'fixed',
                left: 0,
                top: 0,
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
                backgroundColor: '#fff',
                transform: 'translate(-50%, -50%) scale(1)',
                transition: 'transform 220ms ease-out, opacity 140ms ease-out, border-radius 220ms ease-out',
                willChange: 'left, top, transform',
                opacity: 0,
                display: 'grid',
                placeItems: 'center',
            }}
        >
            <div
                ref={hintRef}
                aria-hidden="true"
                style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    borderRadius: '999px',
                    opacity: 0,
                    transform: 'scale(0.6)',
                    transition: 'opacity 140ms ease-out, transform 180ms ease-out',
                    userSelect: 'none',
                }}
            />
        </div>
        </>
    )
}
