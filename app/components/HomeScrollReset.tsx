'use client'

import { useEffect } from 'react'

export default function HomeScrollReset() {
    useEffect(() => {
        const previousScrollRestoration = window.history.scrollRestoration
        window.history.scrollRestoration = 'manual'

        // Al refresh riportiamo sempre la home in cima (Hero).
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        })

        return () => {
            window.history.scrollRestoration = previousScrollRestoration
        }
    }, [])

    return null
}
