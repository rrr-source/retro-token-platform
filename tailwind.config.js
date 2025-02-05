/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff71ce',
        'neon-blue': '#01cdfe',
        'neon-purple': '#b967ff',
        'dark-bg': '#000000',
      },
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'flicker': 'flicker 1.5s infinite alternate',
        'pulse-glow': 'pulse-glow 2s infinite',
        'pixel-move': 'pixel-move 2s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            textShadow: '0 0 5px #b967ff, 0 0 10px #b967ff, 0 0 20px #b967ff',
          },
          '20%, 24%, 55%': {
            textShadow: 'none',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px #b967ff, 0 0 10px #b967ff',
          },
          '50%': {
            boxShadow: '0 0 20px #b967ff, 0 0 30px #b967ff',
          },
        },
      },
    },
  },
  plugins: [],
}