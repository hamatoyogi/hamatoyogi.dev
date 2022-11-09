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
import prefetch from '@astrojs/prefetch';
const SITE_URL = 'https://hamatoyogi.dev';
/** @type {import('astro').AstroUserConfig} */
// https://astro.build/config

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
      // TODO find a way to load dynamically
      customPages: [
        SITE_URL,
        `${SITE_URL}/about`,
        `${SITE_URL}/appearances`,
        `${SITE_URL}/work`,
        `${SITE_URL}/blog`,
        `${SITE_URL}/blog/qwik-next-big-thing`,
        `${SITE_URL}/blog/astro-log/why-astro`,
        `${SITE_URL}/blog/astro-log/getting-markdown-working`,
        `${SITE_URL}/blog/astro-log/connecting-builderio-to-astro`,
      ],
    }),
    compress(),
    prefetch(),
  ],
  site: SITE_URL,
  output: 'server',
  adapter: vercel(),
});
