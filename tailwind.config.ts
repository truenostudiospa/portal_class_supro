import type { Config } from 'tailwindcss'
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { brand: { 500: '#f97316', 600: '#ea580c' } },
      boxShadow: { card: '0 8px 30px rgb(15 23 42 / .08)' },
    },
  },
  plugins: [],
} satisfies Config
