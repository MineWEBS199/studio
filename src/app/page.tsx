export default function Home() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>🌟 Trivia Master</h1>
      <p>¡Bienvenido a tu juego de trivia! Responde preguntas y gana puntos.</p>
      <button style={{ padding: '10px 20px', fontSize: '1.2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Empezar Trivia
      </button>
      {/* Aquí puedes agregar más componentes, como un formulario de preguntas */}
    </main>
  );
}
