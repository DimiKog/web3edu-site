export const ACCENT_PRIMARY = '#1A2A33';   // softened brand dark
export const ACCENT_SECONDARY = '#DDE7EA'; // harmonized light accent

export const WEB3EDU_PALETTE = {
  darkBg: '#0B1221',
  lightBg: '#F3F6FC',
  cyan: '#4BD7EC',
  blue: '#2A7FE8',
  purple: '#7A29D6',
  pink: '#E76CFF',
};

export const GRADIENT_PRIMARY = 'linear-gradient(135deg, #7A29D6, #4BD7EC)';
export const GRADIENT_DIVIDER = 'linear-gradient(90deg, #4BD7EC, #E76CFF)';
export const GRADIENT_HOLOGRAM = 'linear-gradient(180deg, rgba(75,215,236,0.15), rgba(122,41,214,0.15))';

export const CARD_BACKGROUND_MAP = {
  violet: { light: '#F4ECFF', dark: 'rgba(122,41,214,0.20)' },
  indigo: { light: '#EEF2FF', dark: 'rgba(42,127,232,0.20)' },
  emerald: { light: '#E9FBF5', dark: 'rgba(75,215,236,0.18)' },
  blue: { light: '#E7F1FF', dark: 'rgba(42,127,232,0.22)' },
  pink: { light: '#FCE7FF', dark: 'rgba(231,108,255,0.20)' },
  neutral: { light: '#F8FAFC', dark: 'rgba(255,255,255,0.05)' },
};

export const TEXT_COLOR_MAP = {
  light: '#111827',
  dark: '#E5E7EB',
};

export const getCardBackground = (accent, theme) =>
  CARD_BACKGROUND_MAP[accent]?.[theme] || CARD_BACKGROUND_MAP.neutral[theme];