import Nav from './components/Nav'
import Hero from './components/Hero'
import HomeProjectsPreview from './components/HomeProjectsPreview'
import Footer from './components/Footer'
import HomeScrollReset from './components/HomeScrollReset'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'

export default async function Home() {
  // Fetch parallelo — prende settings e works contemporaneamente
  const settings = await client.fetch(siteSettingsQuery)

  return (
    <>
      <HomeScrollReset />
      <main style={{ cursor: 'none' }}>
        <Nav />
        {/* Passiamo l'immagine hero a Hero come prop */}
        <Hero heroImage={settings?.heroImage ?? null} />
        <HomeProjectsPreview />
        <Footer />
      </main>
    </>
  )
}
