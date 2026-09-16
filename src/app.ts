import express, { Application } from 'express';
import { playerRoutes } from './players/player.routes';
import { statisticRoutes } from './statistics/statistic.routes';

const app: Application = express();

app.use(express.json());
app.use('/players', playerRoutes);
app.use('/statistics', statisticRoutes);

export { app };
