const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        coral:    { DEFAULT: '#FF5C35', dark: '#FF7A5C' },
        sunshine: { DEFAULT: '#FFD23F' },
        teal:     { DEFAULT: '#0BC9A0' },
        ink:      { DEFAULT: '#1C1C2E', dark: '#F0ECE4' },
        paper:    { DEFAULT: '#FDFAF5', dark: '#0F1117' },
        surface:  { DEFAULT: '#F4F0E8', dark: '#1A1D2E' },
        border:   { DEFAULT: '#E8E2D6', dark: '#2A2D3E' },
        muted:    { DEFAULT: '#7A7065', dark: '#9A95A8' },
      },
      fontFamily: {
        syne:    ['Syne', ...defaultTheme.fontFamily.sans],
        jakarta: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        mono:    ['Space Mono', ...defaultTheme.fontFamily.mono],
      },
      typography: {
        DEFAULT: {
          css: {
            '--coral': '#FF5C35',
            '--primary-color': 'var(--coral)',
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
