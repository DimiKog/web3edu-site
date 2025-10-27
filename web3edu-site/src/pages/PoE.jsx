// src/pages/Poe.jsx
export default function Poe() {
    return (
        <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '2rem' }}>🧩 Proof of Escape</h1>
            <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
                Proof of Escape is an interactive, blockchain-based quiz designed to test and reward your knowledge.
            </p>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a
                    href="https://proof-of-escape.dimikog.org"
                    style={cardStyle('#DBEAFE')}
                >
                    🔗 Play the Main Game
                </a>

                <a
                    href="/festival"
                    style={cardStyle('#E0F2FE')}
                >
                    🎉 Access Festival Edition
                </a>
            </div>
        </main>
    );
}

function cardStyle(bg) {
    return {
        background: bg,
        padding: '1.25rem',
        borderRadius: '8px',
        textDecoration: 'none',
        color: '#111',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.25s ease',
    };
}