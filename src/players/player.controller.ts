import { Request, Response } from 'express';
import { PlayerService } from './player.service';

export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  getAll = (req: Request, res: Response) => {
    res.json(this.playerService.getAll());
  };
}
