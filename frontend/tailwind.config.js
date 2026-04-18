/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e8f2fc',
          100: '#b5d4f4',
          200: '#85b7eb',
          400: '#378add',
          600: '#1a6bbd',
          800: '#0c447c',
          900: '#042c53',
        },
        mint: {
          50:  '#e1f5ee',
          100: '#9fe1cb',
          400: '#1d9e75',
          600: '#0f6e56',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
      },
      animation: {
        'pulse-ring': 'pulseRing 1.4s ease-out infinite',
        'pulse-ring-delay': 'pulseRing 1.4s ease-out 0.5s infinite',
        'wave': 'wave 0.9s ease-in-out infinite',
        'fade-in': 'fadeIn 0.25s ease',
      },
      keyframes: {
        pulseRing: {
          '0%':   { transform: 'scale(1)',   opacity: '0.45' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        wave: {
          '0%,100%': { height: '6px'  },
          '50%':     { height: '28px' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to:   { opacity: 1, transform: 'translateY(0)'   },
        },
      },
    },
  },
  plugins: [],
};
