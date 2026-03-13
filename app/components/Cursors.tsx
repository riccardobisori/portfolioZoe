'use client'

import { useState, useEffect, useRef } from 'react'

export default function Cursor() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 })
    const [square, setSquare] = useState({ x: 0, y: 0 })
    const [visible, setVisible] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [cursorColor, setCursorColor] = useState('#fff')
    const animRef = useRef<number>(0)

    useEffect(() => {
        const parseRgb = (color: string): [number, number, number] | null => {
            const match = color.match(/\d+(\.\d+)?/g)
            if (!match || match.length < 3) return null
            return [Number(match[0]), Number(match[1]), Number(match[2])]
        }

        const getEffectiveBackground = (start: Element | null): [number, number, number] => {
            let el: Element | null = start
            while (el) {
                const bg = window.getComputedStyle(el).backgroundColor
                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const rgb = parseRgb(bg)
                    if (rgb) return rgb
                }
                el = el.parentElement
            }
            return [255, 255, 255]
        }

        const getRelativeLuminance = ([r, g, b]: [number, number, number]) => {
            const toLinear = (value: number) => {
                const channel = value / 255
                return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
            }
            return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
        }

        const onMouseMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX, y: e.clientY })
            setVisible(true)

            const target = document.elementFromPoint(e.clientX, e.clientY)
            const bgRgb = getEffectiveBackground(target)
            const luminance = getRelativeLuminance(bgRgb)
            setCursorColor(luminance > 0.5 ? '#111' : '#fff')
        }
        const onMouseLeave = () => setVisible(false)
        const onMouseEnter = () => setVisible(true)
        const onMouseDown = () => setClicked(true)
        const onMouseUp = () => setClicked(false)

        const addHoverListeners = () => {
            document.querySelectorAll('a, button').forEach(el => {
                el.addEventListener('mouseenter', () => setHovered(true))
                el.addEventListener('mouseleave', () => setHovered(false))
            })
        }

        window.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseleave', onMouseLeave)
        document.addEventListener('mouseenter', onMouseEnter)
        window.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)
        const timer = setTimeout(addHoverListeners, 0)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseleave', onMouseLeave)
            document.removeEventListener('mouseenter', onMouseEnter)
            window.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mouseup', onMouseUp)
            clearTimeout(timer)
        }
    }, [])

    // Animazione del quadrato con lerp — segue il mouse con inerzia
    // La velocità di inseguimento è controllata dal fattore 0.08
    // più basso = più lento e morbido, più alto = più reattivo
    useEffect(() => {
        const animate = () => {
            setSquare(prev => ({
                x: prev.x + (mouse.x - prev.x) * 0.08,
                y: prev.y + (mouse.y - prev.y) * 0.08,
            }))
            animRef.current = requestAnimationFrame(animate)
        }
        animRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animRef.current)
    }, [mouse])

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null
    }

    // Dimensione del quadrato in base allo stato
    // normale → hover (si ingrandisce) → click (si rimpicciolisce di scatto)
    const sizeSquare = clicked ? 16 : hovered ? 48 : 32
    const sizePoint = hovered ? 8 : 3

    return (
        <>
            {/*
                Punto fisso — segue il mouse istantaneamente.
                È il "vero" cursore, preciso e puntuale.
                Piccolo e discreto — non distrae.
            */}
            <div style={{
                position: 'fixed',
                left: mouse.x,
                top: mouse.y,
                width: `${sizePoint}px`,
                height: `${sizePoint}px`,
                background: cursorColor,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.2s ease, background-color 0.15s ease',
            }} />

            {/*
                Quadrato vuoto — segue con ritardo (lerp).
                Niente border-radius — geometria Bauhaus pura.
                Al hover si ingrandisce per "inquadrare" l'elemento.
                Al click si contrae di scatto — feedback immediato.
                mixBlendMode: difference = si inverte automaticamente
                su sfondi chiari e scuri, zero logica JS per il colore.
            */}
            <div style={{
                position: 'fixed',
                left: square.x,
                top: square.y,
                width: `${sizeSquare}px`,
                height: `${sizeSquare}px`,
                border: `1px solid ${cursorColor}`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 9998,
                opacity: visible ? 0.8 : 0,
                // Transizione solo su size e opacity — il lag è gestito dal lerp
                // non da CSS transition, altrimenti i due si sovrappongono
                transition: 'width 0.12s ease, height 0.12s ease, opacity 0.2s ease, border-color 0.15s ease',
            }} />
        </>
    )
}
