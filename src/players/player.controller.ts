import { Request, Response } from 'express';
import { PlayerService } from './player.service';
import { CreatePlayerInput, GetPlayerParams } from './player.schema';

export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  getAll = async (req: Request, res: Response) => {
    const players = await this.playerService.getAll();
    res.json(players);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = res.locals.params as GetPlayerParams;
    const player = await this.playerService.getById(id);
    res.json(player);
  };

  create = async (req: Request, res: Response) => {
    const data = res.locals.body as CreatePlayerInput;
    const player = await this.playerService.create(data);
    res.status(201).json(player);
  };
}
