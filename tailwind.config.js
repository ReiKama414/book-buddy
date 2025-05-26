/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
      },
      colors: {
        blue: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        purple: {
          50: '#f5e6ff',
          100: '#ebccff',
          200: '#d699ff',
          300: '#c266ff',
          400: '#ad33ff',
          500: '#9900ff',
          600: '#7a00cc',
          700: '#5c0099',
          800: '#3d0066',
          900: '#1f0033',
        },
        yellow: {
          50: '#fffbe6',
          100: '#fff8cc',
          200: '#fff099',
          300: '#ffe966',
          400: '#ffe133',
          500: '#ffd800',
          600: '#ccad00',
          700: '#998200',
          800: '#665700',
          900: '#332c00',
        },
      },
    },
  },
  plugins: [],
};