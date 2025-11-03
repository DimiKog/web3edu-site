// src/pages/Poe.jsx
import { Home } from 'lucide-react';
import './Poe.css';

export default function Poe() {
    return (
        <main className="poe-page">
            {/* 🔗 Floating Home Button */}
            <a
                href="/#/"
                style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
            >
                <Home size={16} /> Home
            </a>

            <h1 style={{ fontSize: '2rem', marginTop: '3rem' }}>🧩 Proof of Escape</h1>
            <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
                Proof of Escape is an interactive, blockchain-based quiz designed to test and reward your knowledge.
            </p>

            <div className="poe-card-grid">
                <a
                    className="poe-card"
                    href="https://dimikog.github.io/proof-of-escape/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={cardStyle('#DBEAFE')}
                >
                    🔗 Play the Main Game
                </a>

                <a
                    className="poe-card"
                    href="https://dimikog.github.io/poe-festival-dapp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={cardStyle('#E0F2FE')}
                >
                    🎉 Access Festival Editionn ↗
                </a>
            </div>
        </main>
    );
}

function cardStyle(bg) {
    return {
        background: bg,
    };
}
