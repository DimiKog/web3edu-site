
function App() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Welcome to Web3Edu
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
        A hub for interactive blockchain education powered by Besu EduNet.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <a
          href="/festival"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#0070f3",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🔗 Explore PoE Festival DApp
        </a>
      </div>
    </main>
  );
}

export default App;
