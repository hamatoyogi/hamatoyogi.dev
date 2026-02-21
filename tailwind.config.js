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
      typography: {
        DEFAULT: {
          css: {
            '--dodger-blue': '#4253ff',
            '--melrose': '#99a2ff',
            '--primary-color': 'var(--dodger-blue)',
            a: {
              display: 'inline-flex',
              'transition-property': 'all',
              'font-weight': '500',
              'text-underline-offset': '4px',
              'text-decoration': 'underline',
              'text-decoration-color': 'var(--primary-color)',
              '&:hover': {
                color: 'var(--primary-color)',
              },
            },
            h1: {
              'font-size': '2.25rem',
              'line-height': '2.5rem',
              'font-weight': '700',
              color: 'var(--primary-color)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
