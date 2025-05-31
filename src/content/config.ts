import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    sidebar: z.boolean().optional().default(true),
  }),
});

export const collections = {
  docs: docsCollection,
};