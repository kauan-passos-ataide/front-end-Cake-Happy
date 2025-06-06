import { CakesSchema } from '@/schemas/cakes-schema';
import { z } from 'zod';

export type ProductType = z.infer<typeof CakesSchema>;
