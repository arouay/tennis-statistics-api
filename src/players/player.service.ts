import { PlayerRepository } from './player.repository';
import { Player } from './player.model';

export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  getAll(): Promise<Player[]> {
    return this.playerRepository.findAll();
  }

  getById(id: number): Promise<Player | null> {
    return this.playerRepository.findById(id);
  }
}
