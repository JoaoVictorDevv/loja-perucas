/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF7F2',
          100: '#F4ECE1',
          200: '#E8D7C2',
          300: '#D9BE9F',
          400: '#C7A27C',
          500: '#B0885E',
          600: '#946E47',
          700: '#755435',
          800: '#583D26',
          900: '#3A2718',
        },
        luxury: {
          gold: '#C5A880',
          dark: '#141414',
          card: '#1C1C1C',
          cream: '#FDFCFA',
          surface: '#F8F5F0',
          border: '#E8E2D8',
          textMuted: '#6B6661'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(20, 20, 20, 0.08), 0 0 1px 1px rgba(20, 20, 20, 0.04)',
        'luxury-hover': '0 25px 50px -12px rgba(176, 136, 94, 0.2), 0 0 1px 1px rgba(176, 136, 94, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
