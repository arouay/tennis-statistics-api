import { Request, Response } from 'express';
import { PlayerService } from './player.service';
import { CreatePlayerInput, GetPlayerParams } from './player.schema';

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
    const { id } = res.locals.params as GetPlayerParams;

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

  create = async (req: Request, res: Response) => {
    const data = res.locals.body as CreatePlayerInput;

    try {
      const player = await this.playerService.create(data);
      if (!player) {
        res.status(400).json({ message: 'Country not found' });
        return;
      }
      res.status(201).json(player);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create player' });
    }
  };
}
