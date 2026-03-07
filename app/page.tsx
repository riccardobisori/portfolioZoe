import Nav from './components/Nav'
import Hero from './components/Hero'
import Works from './components/Works'
import About from './components/About'
import Categories from './components/Categories'
import Footer from './components/Footer'
import Cursors from './components/Cursors'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'

export default async function Home() {
  // Fetch parallelo — prende settings e works contemporaneamente
  const settings = await client.fetch(siteSettingsQuery)

  return (
    <>
      {/* 
        Cursor è fuori dal <main> perché è un elemento globale
        che deve stare sopra tutto il resto della pagina.
        <></> è il Fragment — un wrapper invisibile che non aggiunge
        elementi al DOM, come quando in Java ritorni una lista
        invece di un singolo oggetto  
      */}
      <Cursors />
      <main style={{ cursor: 'none' }}>
        <Nav />
        {/* Passiamo l'immagine hero a Hero come prop */}
        <Hero heroImage={settings?.heroImage ?? null} />
        <Works />
        <About />
        <Categories />
        <Footer />
      </main>
    </>
  )
}