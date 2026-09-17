import { z } from 'zod';
import { Sex } from '../common/constants';

export const getPlayerParamsSchema = z.object({
  id: z.coerce
    .number({ error: 'Invalid player id' })
    .int({ error: 'Invalid player id' })
    .positive({ error: 'Invalid player id' }),
});

export type GetPlayerParams = z.infer<typeof getPlayerParamsSchema>;

export const createPlayerBodySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  shortName: z.string().min(1),
  sex: z.enum([Sex.MALE, Sex.FEMALE]),
  picture: z.url().nullable().optional().default(null),
  countryCode: z.string().length(3),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'birthdate must be in YYYY-MM-DD format' })
    .nullable()
    .optional()
    .default(null),
  points: z.number().int().nonnegative(),
  weightGrams: z.number().int().positive(),
  heightCm: z.number().int().positive(),
  lastResults: z.array(z.union([z.literal(0), z.literal(1)])).optional().default([]),
});

export type CreatePlayerInput = z.infer<typeof createPlayerBodySchema>;
