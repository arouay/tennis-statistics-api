import { z } from 'zod';

export const countrySchema = z
  .object({
    code: z.string(),
    picture: z.string(),
  })
  .meta({ id: 'Country' });
