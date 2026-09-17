import { PlayerRepository } from './player.repository';
import { Player } from './player.model';
import { CreatePlayerInput } from './player.schema';
import { CountryRepository } from '../countries/country.repository';
import { CountryNotFoundError, PlayerNotFoundError } from './player.errors';

export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly countryRepository: CountryRepository,
  ) {}

  getAll(): Promise<Player[]> {
    return this.playerRepository.findAll();
  }

  async getById(id: number): Promise<Player> {
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new PlayerNotFoundError(id);
    }
    return player;
  }

  async create(data: CreatePlayerInput): Promise<Player> {
    const countryExists = await this.countryRepository.exists(data.countryCode);
    if (!countryExists) {
      throw new CountryNotFoundError(data.countryCode);
    }
    return this.playerRepository.create(data);
  }
}
