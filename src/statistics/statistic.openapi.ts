import { z } from 'zod';
import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { countrySchema } from '../countries/country.openapi';

const statisticsSummarySchema = z
  .object({
    topCountryByWinRatio: countrySchema.extend({ winRatio: z.number() }).nullable(),
    averageBmi: z.number().nullable(),
    medianHeight: z.number().nullable(),
  })
  .meta({ id: 'StatisticsSummary' });

export const statisticPaths: ZodOpenApiPathsObject = {
  '/statistics': {
    get: {
      summary: 'Get aggregate player statistics',
      tags: ['Statistics'],
      responses: {
        200: {
          description: 'Statistics summary',
          content: { 'application/json': { schema: statisticsSummarySchema } },
        },
      },
    },
  },
};
