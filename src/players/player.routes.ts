import { Router } from 'express';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';

const router = Router();
const playerController = new PlayerController(new PlayerService(new PlayerRepository()));

router.get('/', playerController.getAll);

export { router as playerRoutes };
