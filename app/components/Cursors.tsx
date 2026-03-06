'use client'

// Il cursore custom richiede:
// - useState per tracciare la posizione
// - useEffect per aggiungere/rimuovere l'event listener sul mouse
import { useState, useEffect } from 'react'

export default function Cursor() {
    // Stato per la posizione del punto centrale (segue il mouse istantaneamente)
    const [mouse, setMouse] = useState({ x: 0, y: 0 })

    // Stato per la posizione dell'anello (segue con ritardo — effetto lag)
    const [ring, setRing] = useState({ x: 0, y: 0 })

    // Stato per sapere se il mouse è sopra un elemento cliccabile
    // true = cursore ingrandito, false = cursore normale
    const [hovered, setHovered] = useState(false)

    // Stato per nascondere il cursore quando esce dalla finestra
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Aggiorna la posizione del punto centrale — istantaneo
        const onMouseMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX, y: e.clientY })
            setVisible(true)
        }

        // Nasconde il cursore quando esce dalla finestra
        const onMouseLeave = () => setVisible(false)
        const onMouseEnter = () => setVisible(true)

        // Rileva quando il mouse è sopra elementi interattivi
        // querySelectorAll prende tutti i link, bottoni e card
        const addHoverListeners = () => {
            const targets = document.querySelectorAll('a, button, .work-item, .cat-item')
            targets.forEach(el => {
                el.addEventListener('mouseenter', () => setHovered(true))
                el.addEventListener('mouseleave', () => setHovered(false))
            })
        }

        window.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseleave', onMouseLeave)
        document.addEventListener('mouseenter', onMouseEnter)

        // Aspettiamo che il DOM sia pronto prima di aggiungere gli hover listener
        // setTimeout 0 = esegui al prossimo tick, dopo il render
        const timer = setTimeout(addHoverListeners, 0)

        // Cleanup — rimuoviamo tutti i listener quando il componente viene smontato
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseleave', onMouseLeave)
            document.removeEventListener('mouseenter', onMouseEnter)
            clearTimeout(timer)
        }
    }, [])

    // Animazione dell'anello — segue il mouse con inerzia (lerp)
    // lerp = linear interpolation: sposta l'anello del 12% verso il mouse ad ogni frame
    useEffect(() => {
        let animFrame: number

        const animate = () => {
            // L'anello si avvicina al mouse del 12% ad ogni frame — crea il lag visivo
            setRing(prev => ({
                x: prev.x + (mouse.x - prev.x) * 0.12,
                y: prev.y + (mouse.y - prev.y) * 0.12,
            }))
            // requestAnimationFrame = esegui al prossimo frame del browser (~60fps)
            // come un loop ma sincronizzato con il refresh rate dello schermo
            animFrame = requestAnimationFrame(animate)
        }

        animFrame = requestAnimationFrame(animate)

        // Cleanup — fermiamo il loop quando il componente viene smontato
        return () => cancelAnimationFrame(animFrame)
    }, [mouse]) // ri-esegui quando mouse cambia posizione

    // Su mobile non mostriamo il cursore custom
    // (i dispositivi touch non hanno cursore)
    // typeof window check necessario perché questo codice gira anche sul server
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null
    }

    return (
        <>
            {/* Punto centrale — segue il mouse istantaneamente */}
            <div style={{
                position: 'fixed',
                left: mouse.x,
                top: mouse.y,
                width: hovered ? '14px' : '8px',
                height: hovered ? '14px' : '8px',
                background: 'var(--ink)',
                borderRadius: '50%',
                // translate(-50%, -50%) centra il punto sul cursore
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none', // non intercetta click — il click passa "attraverso"
                zIndex: 9999,
                // transition solo su width/height per l'effetto ingrandimento
                transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
                opacity: visible ? 1 : 0,
            }} />

            {/* Anello esterno — segue con ritardo (lerp) */}
            <div style={{
                position: 'fixed',
                left: ring.x,
                top: ring.y,
                width: hovered ? '52px' : '36px',
                height: hovered ? '52px' : '36px',
                border: '1px solid var(--ink)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 9998,
                transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
                opacity: visible ? 0.5 : 0,
            }} />
        </>
    )
}