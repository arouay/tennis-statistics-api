import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { playerRoutes } from './players/player.routes';
import { statisticRoutes } from './statistics/statistic.routes';
import { errorHandler } from './common/middleware/error-handler.middleware';
import { generateOpenApiDocument } from './openapi/document';

const app: Application = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(generateOpenApiDocument()));
app.use('/players', playerRoutes);
app.use('/statistics', statisticRoutes);
app.use(errorHandler);

export { app };
