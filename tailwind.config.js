/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red:   { 700: '#B91C1C', 600: '#DC2626', 100: '#FEE2E2' },
          orange:{ 700: '#C2410C', 600: '#EA580C', 100: '#FFEDD5' },
        },
        surface: '#0B0F1A',
        borderw: '#FFFFFF1A',
      },
      backgroundImage: {
        'hero-warm':
          'linear-gradient(135deg, #B91C1C 0%, #EA580C 55%, #F97316 100%)',
        'footer-deep':
          'linear-gradient(180deg, #0B0F1A 0%, #111827 40%, #1F2937 100%)',
      },
      boxShadow: {
        warm: '0 10px 30px -10px rgba(234,88,12,0.45)',
      }
    }
  },
  plugins: [],
}

