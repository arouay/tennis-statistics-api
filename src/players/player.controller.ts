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

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ message: 'Invalid player id' });
      return;
    }

    try {
      const player = await this.playerService.getById(id);
      if (!player) {
        res.status(404).json({ message: 'Player not found' });
        return;
      }
      res.json(player);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch player' });
    }
  };
}
