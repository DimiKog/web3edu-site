import { useState } from 'react';
import {
  Puzzle, BadgeCheck, Landmark, GraduationCap, Eye,
} from 'lucide-react';

const App = () => {
  const [lang, setLang] = useState('EN');

  const content = {
    EN: {
      welcome: 'Welcome to Web3Edu',
      desc: 'A portal for exploring blockchain learning tools and experiments — powered by Besu EduNet and built for students, researchers, and educators.',
      switch: 'Switch to Greek',
      footer: {
        name: 'Dimitris G. Kogias',
        role: 'Blockchain Educator & Researcher',
        site: 'Visit my personal website',
      },
    },
    GR: {
      welcome: 'Καλώς ήρθατε στο Web3Edu',
      desc: 'Μια πύλη για την εξερεύνηση εκπαιδευτικών εργαλείων και εφαρμογών Web3 — βασισμένη στο Besu EduNet και σχεδιασμένη για φοιτητές, ερευνητές και εκπαιδευτικούς.',
      switch: 'Switch to English',
      footer: {
        name: 'Δημήτρης Γ. Κόγιας',
        role: 'Εκπαιδευτής και Ερευνητής Blockchain',
        site: 'Επισκεφτείτε την προσωπική μου σελίδα',
      },
    },
  };

  const apps = [
    {
      title: 'Proof of Escape',
      description:
        lang === 'EN'
          ? 'Enter the Web3 quiz experience: main game or festival edition.'
          : 'Εκπαιδευτικό παιχνίδι Web3 — βασική και φεστιβαλική έκδοση.',
      link: '/#/poe',
      icon: <Puzzle size={32} color="#8B5CF6" />,
      bg: '#EDE9FE',
    },
    {
      title: lang === 'EN' ? 'Education Portal' : 'Εκπαιδευτικό Υλικό',
      description:
        lang === 'EN'
          ? 'Course content, NFTs, and student resources.'
          : 'Υλικό μαθημάτων, NFTs και εκπαιδευτικοί πόροι.',
      link: '/#/education',
      icon: <GraduationCap size={32} color="#6366F1" />,
      bg: '#EEF2FF',
    },
    {
      title: 'NFT Verifier',
      description:
        lang === 'EN'
          ? 'Check if your address owns the required PoE or SBT NFT.'
          : 'Επαλήθευση κατόχου NFT για πρόσβαση.',
      link: '/#/nft-verifier',
      icon: <BadgeCheck size={32} color="#34D399" />,
      bg: '#ECFDF5',
    },
    {
      title: 'DAO Playground',
      description:
        lang === 'EN'
          ? 'Vote and propose using your NFT as a DAO credential.'
          : 'Ψηφίστε ή προτείνετε στο DAO χρησιμοποιώντας το NFT σας.',
      link: '/#/dao',
      icon: <Landmark size={32} color="#6366F1" />,
      bg: '#EEF2FF',
    },
    {
      title: 'ZKP Module',
      description:
        lang === 'EN'
          ? 'Learn Zero-Knowledge Proofs with visual examples.'
          : 'Μάθετε για τα ZKP με διαδραστικά παραδείγματα.',
      link: '/#/zkp',
      icon: <Eye size={32} color="#F59E0B" />,
      bg: '#FFFBEB',
    },
  ];

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        background: '#f9fafb',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Language toggle */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button
          onClick={() => setLang(lang === 'EN' ? 'GR' : 'EN')}
          style={{ background: 'transparent', border: 'none', fontSize: '1rem' }}
        >
          🌐 {content[lang].switch}
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
          👋 {content[lang].welcome}
        </h1>
        <p
          style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            color: '#374151',
          }}
        >
          {content[lang].desc}
        </p>

        {/* App Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {apps.map((app, index) => (
            <a
              key={index}
              href={app.link}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                background: app.bg,
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#111',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ marginBottom: '1rem' }}>{app.icon}</div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{app.title}</h2>
              <p style={{ fontSize: '1rem', color: '#374151' }}>{app.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '2rem 1rem 1rem',
          borderTop: '1px solid #e5e7eb',
          marginTop: '2rem',
        }}
      >
        <img
          src="/dimi.jpeg"
          alt="Dimitris avatar"
          style={{ width: '80px', borderRadius: '50%', marginBottom: '0.5rem' }}
        />
        <div style={{ fontWeight: 'bold' }}>{content[lang].footer.name}</div>
        <div style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '0.3rem' }}>
          {content[lang].footer.role}
        </div>
        <a
          href="https://dimikog.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#2563eb',
            textDecoration: 'underline',
            fontSize: '0.95rem',
          }}
        >
          {content[lang].footer.site}
        </a>
      </footer>
    </main>
  );
};

export default App;