/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    safelist: [
        "font-semibold",
        "text-slate-900",
        "dark:text-white",
        "font-semibold text-slate-900 dark:text-white",
        "text-slate-900 dark:text-white font-semibold",
        "dark:text-white font-semibold text-slate-900"
    ],
    theme: {
        extend: {
            keyframes: {
                fadeInSlow: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                    '50%': { opacity: '0.7', transform: 'scale(1.05)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'border-pulse': {
                    '0%, 100%': { borderColor: 'rgba(138, 87, 255, 0.3)' },
                    '50%': { borderColor: 'rgba(138, 87, 255, 0.6)' },
                },
            },
            animation: {
                fadeInSlow: 'fadeInSlow 1.2s ease-out forwards',
                float: 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
                shimmer: 'shimmer 3s ease-in-out infinite',
                'fade-up': 'fade-up 0.6s ease-out forwards',
                'fade-up-delay-1': 'fade-up 0.6s ease-out 0.1s forwards',
                'fade-up-delay-2': 'fade-up 0.6s ease-out 0.2s forwards',
                'fade-up-delay-3': 'fade-up 0.6s ease-out 0.3s forwards',
                'fade-up-delay-4': 'fade-up 0.6s ease-out 0.4s forwards',
                'border-pulse': 'border-pulse 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};