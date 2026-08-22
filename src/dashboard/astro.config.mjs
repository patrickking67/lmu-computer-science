import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// SITE and BASE are supplied by the Pages workflow so the same source builds
// correctly at a user-site root and at a project-site subpath. Locally they
// default to a root-served dev server.
const site = process.env.SITE_URL ?? 'https://patrickking67.github.io';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [mdx(), react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
