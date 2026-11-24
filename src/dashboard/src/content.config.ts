import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const wiki = defineCollection({
  loader: glob({ base: './src/content/wiki', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { wiki };
