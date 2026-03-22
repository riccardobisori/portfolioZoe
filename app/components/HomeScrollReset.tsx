'use client'

import { useEffect } from 'react'

export default function HomeScrollReset() {
    useEffect(() => {
        const previousScrollRestoration = window.history.scrollRestoration
        window.history.scrollRestoration = 'manual'
        const hash = window.location.hash

        if (hash) {
            let attempts = 0
            let timeoutId = 0

            const scrollToHashTarget = () => {
                const target = document.getElementById(hash.slice(1))

                if (target) {
                    target.scrollIntoView({ block: 'start' })
                    return
                }

                if (attempts >= 12) return

                attempts += 1
                timeoutId = window.setTimeout(scrollToHashTarget, 80)
            }

            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(scrollToHashTarget)
            })

            return () => {
                window.clearTimeout(timeoutId)
                window.history.scrollRestoration = previousScrollRestoration
            }
        } else {
            // Al refresh riportiamo sempre la home in cima (Hero).
            window.requestAnimationFrame(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
            })
        }

        return () => {
            window.history.scrollRestoration = previousScrollRestoration
        }
    }, [])

    return null
}
