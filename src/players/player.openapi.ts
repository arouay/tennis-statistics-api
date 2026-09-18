import { z } from 'zod';
import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { errorResponseSchema } from '../openapi/shared-schemas';
import { countrySchema } from '../countries/country.openapi';
import { createPlayerBodySchema, getPlayerParamsSchema } from './player.schema';

const playerSchema = z
  .object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    shortName: z.string(),
    sex: z.enum(['M', 'F']),
    picture: z.string().nullable(),
    country: countrySchema,
    data: z.object({
      rank: z.number(),
      points: z.number(),
      weight: z.number(),
      height: z.number(),
      age: z.number().nullable(),
      last: z.array(z.number()),
    }),
  })
  .meta({ id: 'Player' });

export const playerPaths: ZodOpenApiPathsObject = {
  '/players': {
    get: {
      summary: 'List all players, ranked by points',
      tags: ['Players'],
      responses: {
        200: {
          description: 'List of players',
          content: { 'application/json': { schema: z.array(playerSchema) } },
        },
      },
    },
    post: {
      summary: 'Create a new player',
      tags: ['Players'],
      requestBody: {
        content: { 'application/json': { schema: createPlayerBodySchema } },
      },
      responses: {
        201: {
          description: 'Player created',
          content: { 'application/json': { schema: playerSchema } },
        },
        400: {
          description: 'Invalid payload or unknown country',
          content: { 'application/json': { schema: errorResponseSchema } },
        },
      },
    },
  },
  '/players/{id}': {
    get: {
      summary: 'Get a player by id',
      tags: ['Players'],
      requestParams: { path: getPlayerParamsSchema },
      responses: {
        200: {
          description: 'Player found',
          content: { 'application/json': { schema: playerSchema } },
        },
        400: {
          description: 'Invalid player id',
          content: { 'application/json': { schema: errorResponseSchema } },
        },
        404: {
          description: 'Player not found',
          content: { 'application/json': { schema: errorResponseSchema } },
        },
      },
    },
  },
};
