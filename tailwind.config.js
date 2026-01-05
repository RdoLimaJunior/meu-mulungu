/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./App.tsx", 
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mulungu: {
          50: '#f2fbf4',
          100: '#dbf5e0',
          200: '#b6eabb',
          300: '#85d98e',
          400: '#6ABA6B',
          500: '#2eac4e',
          600: '#009639',
          700: '#007a2e',
          800: '#065f27',
          900: '#024d21',
          blue: '#0057A4',
          yellow: '#FFDD00',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideInUp 0.4s ease-out forwards',
        'zoom-in': 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideInUp: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          'from': { opacity: '0', transform: 'scale(0.96)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
}