import { defineCollection, z } from 'astro:content';

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Writing Tips', 'Handbook', 'How-To', 'Blog']),
    publishedDate: z.date(),
    author: z.string().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { resources };
