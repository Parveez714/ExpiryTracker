/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          bg: '#FDFCFA',
        },
        graphite: {
          header: '#1C1914',
        },
        shell: {
          DEFAULT: '#EAE7DC',
          muted: '#E1DED3',
          deep: '#D8D2BF',
        },
        brand: {
          text: '#221F1B',
          desc: '#6B6459',
          meta: '#96908A',
          border: '#DDD7C6',
          blue: '#0066CC',
        },
        // Warm dark-mode surface scale, tuned to sit alongside the
        // existing cream/graphite/shell palette instead of a generic gray.
        ink: {
          50: '#F4F1EA',
          200: '#D8D2C5',
          400: '#9C948A',
          700: '#332D24',
          800: '#242019',
          900: '#1A1815',
          950: '#121110',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}




