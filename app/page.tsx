import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Works from './components/Works'
import About from './components/About'
import Categories from './components/Categories'
import Footer from './components/Footer'
import Cursors from './components/Cursors'

export default function Home() {
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
        <Hero />
        <Marquee />
        <Works />
        <About />
        <Categories />
        <Footer />
      </main>
    </>
  )
}