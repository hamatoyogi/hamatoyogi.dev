/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EBF9EF',
          100: '#D7F4DF',
          200: '#B4E9C2',
          300: '#8CDEA2',
          400: '#68D485',
          500: '#42C966',
          600: '#30A74F',
          700: '#237B3B',
          800: '#185328',
          900: '#0B2813',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
