const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

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
        palette: {
          200: '#E7F6F2',
          400: '#A5C9CA',
          600: '$A5C9CA',
          800: '#2C3333',
        },
      },
      fontFamily: {
        inter: ['Inter', ...defaultTheme.fontFamily.mono],
        space: ['Space Grotesk', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addVariant }) => {
      addVariant('data-open', "&[data-state='open']");
      addVariant('data-closed', "&[data-state='closed']");
    }),
  ],
};
