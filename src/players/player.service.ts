import { PlayerRepository } from './player.repository';
import { Player } from './player.model';
import { CreatePlayerInput } from './player.schema';
import { CountryRepository } from '../countries/country.repository';

export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly countryRepository: CountryRepository,
  ) {}

  getAll(): Promise<Player[]> {
    return this.playerRepository.findAll();
  }

  getById(id: number): Promise<Player | null> {
    return this.playerRepository.findById(id);
  }

  async create(data: CreatePlayerInput): Promise<Player | null> {
    const countryExists = await this.countryRepository.exists(data.countryCode);
    if (!countryExists) {
      return null;
    }
    return this.playerRepository.create(data);
  }
}
