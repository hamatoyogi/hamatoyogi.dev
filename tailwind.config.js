const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Light Theme
        'dodger-blue': '#4253FF',
        'shuttle-gray': '#596373',
        'white-lilac': '#F4F5FB',
        'mine-shaft': '#333333',

        // Dark Theme
        mirage: '#151724',
        melrose: '#99A2FF',
        'lavender-gray': '#B8B4D3',
        'ebony-clay': '#262940',
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
