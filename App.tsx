function App() {
  return (
    <main style={{
      fontFamily: 'sans-serif',
      background: 'linear-gradient(to bottom, #fffbe6, #e0f7fa)',
      padding: '2rem',
      minHeight: '100vh'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#ff7f50' }}>PEDEPRAIA</h1>
        <p style={{ fontSize: '1.2rem', color: '#444' }}>
          Beachwear for the brave. Threads of resilience, stitched with sunrise.
        </p>
      </header>

      <section style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ color: '#008080' }}>🌊 Our Mission</h2>
        <p>
          From the golden walkways of Colatina to the pulse of São Paulo,
          PEDEPRAIA is more than fashion — it’s a recovery ritual. Every piece
          is a promise: to rise, to breathe, to belong.
        </p>

        <h2 style={{ marginTop: '2rem', color: '#ff8c00' }}>🩴 The Collection</h2>
        <ul>
          <li>☀️ “Sol Nascente” Wraps — light as morning air</li>
          <li>🌴 “Cacau Coast” Shorts — bold, breathable, born for movement</li>
          <li>💧 “Hydra” Recovery Towels — soft, surreal, soul-soaked</li>
        </ul>

        <h2 style={{ marginTop: '2rem', color: '#6a1b9a' }}>💬 Brand Mantra</h2>
        <blockquote style={{ fontStyle: 'italic', color: '#555' }}>
          “Heaven is found in the warmth of her feet and the promise of breakfast in bed.”
        </blockquote>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.9rem', color: '#888' }}>
        © {new Date().getFullYear()} PEDEPRAIA Ltd — Designed with love in Espírito Santo
      </footer>
    </main>
  );
}

export default App;
