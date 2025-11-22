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
            },
            animation: {
                fadeInSlow: 'fadeInSlow 1.2s ease-out forwards',
            },
        },
    },
    plugins: [],
};