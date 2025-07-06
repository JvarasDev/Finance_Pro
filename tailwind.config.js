/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          'SF Pro Display',
          'Segoe UI',
          'Arial',
          'Helvetica Neue',
          'sans-serif',
        ],
        serif: [
          'Georgia',
          'Times New Roman',
          'serif',
        ],
      },
      colors: {
        gold: '#b5a642',
        dark: '#232323',
        accent: '#1e2d24',
        light: '#f5f5f7',
      },
      boxShadow: {
        premium: '0 8px 32px 0 rgba(181, 166, 66, 0.18)',
        glass: '0 4px 24px 0 rgba(35,35,35,0.12)',
      },
      fontFamily: {
        display: [
          'SF Pro Display',
          'Segoe UI',
          'Arial',
          'Helvetica Neue',
          'sans-serif',
        ],
        serif: [
          'Georgia',
          'Times New Roman',
          'serif',
        ],
      },
      colors: {
        gold: '#b5a642',
        dark: '#232323',
        accent: '#1e2d24',
        light: '#f5f5f7',
      },
      boxShadow: {
        premium: '0 8px 32px 0 rgba(181, 166, 66, 0.18)',
        glass: '0 4px 24px 0 rgba(35,35,35,0.12)',
      },
    },
  },
  plugins: [],
}
