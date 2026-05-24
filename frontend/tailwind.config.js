/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#121358',
          50: '#e8e8f5',
          100: '#c5c5e6',
          200: '#9e9ed6',
          300: '#7676c5',
          400: '#5757b9',
          500: '#3939ac',
          600: '#2e2e98',
          700: '#212180',
          800: '#181868',
          900: '#121358',
        },
      },
    },
  },
  plugins: [],
};
