/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f2f5',
          100: '#f2d9e3',
          200: '#e6b3c7',
          300: '#d98cab',
          400: '#cc668f',
          500: '#bf4073',
          600: '#7D1D3F', // primary
          700: '#66193a',
          800: '#4d1335',
          900: '#330d30',
        },
        secondary: {
          50: '#f2f3f5',
          100: '#d9dce6',
          200: '#b3b9cc',
          300: '#8c96b3',
          400: '#667399',
          500: '#405080',
          600: '#1E2749', // secondary
          700: '#19203d',
          800: '#131931',
          900: '#0d1224',
        },
        accent: {
          50: '#faf7ef',
          100: '#f5efd9',
          200: '#ebdfb3',
          300: '#e2d08d',
          400: '#D6AD60', // accent
          500: '#c99a45',
          600: '#b38a3d',
          700: '#997536',
          800: '#80622e',
          900: '#664e25',
        },
        neutral: {
          50: '#F5F0E6', // background
          100: '#e6e0d9',
          200: '#d9d1c7',
          300: '#bfb3a6',
          400: '#a69985',
          500: '#8c7f64',
          600: '#736643',
          700: '#594d32',
          800: '#403321',
          900: '#261a10',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'page-turn': 'pageTurn 0.6s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(10deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};