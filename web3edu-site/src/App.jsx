import { useState } from 'react';

export default function App() {
  const [lang, setLang] = useState('EN'); // toggle EN or GR

  const content = {
    EN: {
      title: 'Welcome to Web3Edu',
      message: `This site is a growing hub for blockchain-powered learning tools,
      experimental dApps, and interactive experiences developed for students,
      educators, and innovators.`,
      festival: `The first release is the PoE Festival Edition – an educational game
      that rewards participation with a unique Festival NFT and grants access
      to the Web3Edu DAO.`,
      button: '🎉 Go to PoE Festival Experience',
    },
    GR: {
      title: 'Καλώς ήρθατε στο Web3Edu',
      message: `Αυτός ο ιστότοπος αποτελεί ένα αναδυόμενο κέντρο εκπαιδευτικών εργαλείων βασισμένων στο blockchain,
      με διαδραστικές εφαρμογές και δραστηριότητες για φοιτητές, ερευνητές και εκπαιδευτικούς.`,
      festival: `Η πρώτη μας κυκλοφορία είναι η Festival Edition του PoE – ένα εκπαιδευτικό παιχνίδι
      που ανταμείβει τη συμμετοχή με ένα μοναδικό NFT και δίνει πρόσβαση στη Web3Edu DAO.`,
      button: '🎉 Μετάβαση στην Εμπειρία PoE Festival',
    },
  };

  const c = content[lang];

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        background: 'linear-gradient(to bottom right, #eef2f3, #cfd9df)',
      }}
    >
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button onClick={() => setLang(lang === 'EN' ? 'GR' : 'EN')}>
          🌐 {lang === 'EN' ? 'GR' : 'EN'}
        </button>
      </div>

      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#111' }}>
        {c.title}
      </h1>

      <p
        style={{
          fontSize: '1.2rem',
          maxWidth: '700px',
          textAlign: 'center',
          marginBottom: '1rem',
          color: '#333',
        }}
      >
        {c.message}
        <br />
        <br />
        🧩 {c.festival}
      </p>

      <a
        href="/festival"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          textDecoration: 'none',
        }}
      >
        {c.button}
      </a>
    </main>
  );
}