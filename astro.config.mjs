import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  integrations: [tailwind(), react(), mdx()],
  site: 'https://trunk-os.github.io',
  base: '/',
  markdown: {
    remarkPlugins: [remarkGfm],
  },
});
