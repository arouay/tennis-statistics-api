import { createDocument } from 'zod-openapi';
import { playerPaths } from '../players/player.openapi';
import { statisticPaths } from '../statistics/statistic.openapi';

export function generateOpenApiDocument() {
  return createDocument({
    openapi: '3.1.0',
    info: {
      title: 'Tennis Statistics API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      ...playerPaths,
      ...statisticPaths,
    },
  });
}
