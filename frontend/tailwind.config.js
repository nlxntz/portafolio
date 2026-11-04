/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#06060c',
          900: '#0a0a14',
          850: '#0e0e1c',
          800: '#141428',
          700: '#1e1e38',
        },
        brand: {
          purple: '#9333ea',
          indigo: '#6366f1',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 30px -5px rgba(147, 51, 234, 0.3)',
        'glow-indigo': '0 0 30px -5px rgba(99, 102, 241, 0.3)',
      }
    },
  },
  plugins: [],
}
