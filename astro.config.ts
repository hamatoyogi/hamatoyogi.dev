import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import solid from '@astrojs/solid-js';
/** @type {import('astro').AstroUserConfig} */

import partytown from '@astrojs/partytown';
import image from '@astrojs/image';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    react(),
    svelte(),
    solid(),
    partytown({}),
    image(),
    sitemap(),
  ],
  site: 'https://hamatoyogi.dev',
  output: 'server',
  adapter: vercel(),
});
