import { defineConfig } from 'astro/config';
import { astroImageTools } from 'astro-imagetools';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import solid from '@astrojs/solid-js';
/** @type {import('astro').AstroUserConfig} */

import lit from '@astrojs/lit';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    astroImageTools,
    mdx(),
    react(),
    svelte(),
    solid(),
    lit(),
    partytown({ config: { debug: true } }),
  ],
});
