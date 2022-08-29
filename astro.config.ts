import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import solid from '@astrojs/solid-js';
/** @type {import('astro').AstroUserConfig} */

import lit from '@astrojs/lit';
import partytown from '@astrojs/partytown';

import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    react(),
    svelte(),
    solid(),
    lit(),
    partytown({}),
    image(),
  ],
});
