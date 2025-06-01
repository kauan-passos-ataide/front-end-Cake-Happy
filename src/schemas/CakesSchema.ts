import { z } from 'zod';

export const CakesSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  description: z.string(),
});
