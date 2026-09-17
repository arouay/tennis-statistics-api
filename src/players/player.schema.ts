import { z } from 'zod';

export const getPlayerParamsSchema = z.object({
  id: z.coerce
    .number({ error: 'Invalid player id' })
    .int({ error: 'Invalid player id' })
    .positive({ error: 'Invalid player id' }),
});

export type GetPlayerParams = z.infer<typeof getPlayerParamsSchema>;
