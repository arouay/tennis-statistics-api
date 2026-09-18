import { z } from 'zod';

export const errorResponseSchema = z
  .object({
    message: z.string(),
  })
  .meta({ id: 'ErrorResponse' });
