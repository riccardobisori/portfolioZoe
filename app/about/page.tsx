import Nav from '@/app/components/Nav'
import About from '@/app/components/About'

export default function AboutPage() {
    return (
        <main className="paper-texture-surface" style={{ cursor: 'none', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Nav />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <About />
            </div>
        </main>
    )
}
