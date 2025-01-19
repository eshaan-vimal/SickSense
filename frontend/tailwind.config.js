module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#128c7e', // Teal
        secondary: '#075e54', // Dark Green
        accent: '#25d366',   // Bright Green
        background: '#dcf8c6', // Light Green
        textPrimary: '#236f61', // Teal-Dark for text
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        cursive: ['Playfair Display', 'serif'], // For aesthetic cursive-like elements
      },
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        'gradient-y': 'gradient-y 10s ease infinite',
        'fade-in': 'fade-in 1s ease-in forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'gradient-y': {
          '0%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
          '100%': { backgroundPosition: '50% 0%' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
