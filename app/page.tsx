import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Works from './components/Works'
import About from './components/About'
import Categories from './components/Categories'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Marquee />
      <Works />
      <About />
      <Categories />
      <Footer />
    </main>
  )
}