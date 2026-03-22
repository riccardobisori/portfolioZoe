import Nav from '@/app/components/Nav'
import About from '@/app/components/About'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'

export default async function AboutPage() {
    const settings = await client.fetch(siteSettingsQuery)

    return (
        <main className="paper-texture-surface" style={{ cursor: 'none', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Nav />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <About aboutImage={settings?.aboutImage ?? null} />
            </div>
        </main>
    )
}
