import { Request, Response } from 'express';
import { PlayerService } from './player.service';

export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const players = await this.playerService.getAll();
      res.json(players);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch players' });
    }
  };
}
