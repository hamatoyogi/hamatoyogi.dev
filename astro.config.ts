import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import solid from '@astrojs/solid-js';
import partytown from '@astrojs/partytown';
import image from '@astrojs/image';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
import compress from 'astro-compress';

/** @type {import('astro').AstroUserConfig} */

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
    sitemap({
      customPages: [
        'https://hamatoyogi.dev',
        'https://hamatoyogi.dev/blog',
        'https://hamatoyogi.dev/blog/why-astro',
        'https://hamatoyogi.dev/about',
        'https://hamatoyogi.dev/appearances',
        'https://hamatoyogi.dev/work',
      ],
    }),
    compress(),
  ],
  site: 'https://hamatoyogi.dev',
  output: 'server',
  adapter: vercel(),
});
