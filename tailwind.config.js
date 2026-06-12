/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './viewmodels/**/*.{js,ts}',
    './app.vue',
  ],
  // Disable Tailwind base resets to avoid conflict with Vuetify
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF0F5',
          100: '#FFE0EB',
          200: '#F8BBD0',
          300: '#F48FB1',
          400: '#F06292',
          500: '#EC407A',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Be Vietnam Pro', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
