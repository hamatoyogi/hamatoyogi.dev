# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Yoav Ganbar's personal website built with Astro 5, hosted on Vercel. The site is a blog and portfolio showcasing web development work, podcast appearances, and community involvement.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Format code with Prettier
pnpm prettier

# Check Stylelint configuration
pnpm stylelint-check
```

## Architecture

**Framework**: Astro 5 with TypeScript, using SSR mode and Vercel adapter

**Styling**: TailwindCSS 4 with custom color scheme supporting dark/light themes

**Content**: Mix of Astro pages, MDX files, and markdown blog posts

**Integrations**:

- Qwik components via `@qwikdev/astro`
- MDX for rich content
- Partytown for third-party scripts
- Sitemap generation
- Content compression

## Key Directories

- `src/components/` - Reusable Astro components organized by feature
- `src/pages/` - File-based routing with Astro pages and API endpoints
- `src/layouts/` - Layout components (BaseLayout, MarkdownLayout)
- `src/utils/` - Utility functions for blog parsing, date formatting, SEO
- `src/assets/` - Static images and media files
- `public/` - Static assets served directly

## Path Aliases

The project uses TypeScript path mapping:

- `~components/*` → `src/components/*`
- `~assets/*` → `src/assets/*`
- `~style/*` → `src/style/*`
- `~layouts/*` → `src/components/layouts/`
- `~typography/*` → `src/components/typography/`
- `~types/*` → `src/types/*`

## Component Structure

Components follow a consistent pattern:

- Each component has its own directory under `src/components/`
- Main component file is named after the directory (e.g., `Card.astro`)
- Index file exports the component for clean imports
- Components use TypeScript interfaces for props

## Blog System

- Blog posts are in `src/pages/blog/` as `.md` and `.astro` files
- Markdown posts use frontmatter for metadata
- Post parsing utilities in `src/utils/parse-posts.ts`
- RSS feed generated at `/rss.xml`

## Styling

- TailwindCSS with custom theme in `tailwind.config.js`
- Dark mode support via `class` strategy
- Custom colors for light/dark themes
- Typography plugin for markdown content
- Global styles in `src/style/tailwind.css`

## Deployment

- Hosted on Vercel with automatic deployments
- Server-side rendering enabled
- Sitemap includes hardcoded page list (TODO: make dynamic)
- Cache headers set for performance
