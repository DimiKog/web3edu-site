import { GraduationCap, Puzzle, BadgeCheck, Landmark, Eye } from 'lucide-react';

const apps = [
  {
    title: 'Proof of Escape',
    description: 'Enter the Web3 quiz experience: main game or festival edition.',
    link: '/poe',
    icon: <Puzzle size={32} color="#8B5CF6" />,
    bg: '#EDE9FE',
  },
  {
    title: 'Education Portal',
    description: 'Course content, participation NFTs, and student materials.',
    link: '/education',
    icon: <GraduationCap size={32} color="#6366F1" />,
    bg: '#EEF2FF',
  },
  {
    title: 'NFT Verifier',
    description: 'Check if your address owns the required PoE or SBT NFT.',
    link: '/nft-verifier',
    icon: <BadgeCheck size={32} color="#34D399" />,
    bg: '#ECFDF5',
  },
  {
    title: 'DAO Playground',
    description: 'Vote and propose using your festival NFT as a credential.',
    link: '/dao',
    icon: <Landmark size={32} color="#6366F1" />,
    bg: '#EEF2FF',
  },
  {
    title: 'ZKP Module',
    description: 'Learn Zero-Knowledge Proofs with visual examples.',
    link: '/zkp',
    icon: <Eye size={32} color="#F59E0B" />,
    bg: '#FFFBEB',
  },
];

function App() {
  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        background: '#f9fafb',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
        👋 Welcome to Web3Edu
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
        A portal for exploring blockchain learning tools and experiments —
        powered by Besu EduNet and built for students, researchers, and educators.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
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
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              {app.title}
            </h2>
            <p style={{ fontSize: '1rem', color: '#374151' }}>{app.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}

export default App;