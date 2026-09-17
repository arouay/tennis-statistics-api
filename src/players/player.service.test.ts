import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';
import { Player } from './player.model';
import { CreatePlayerInput } from './player.schema';
import { CountryRepository } from '../countries/country.repository';
import { CountryNotFoundError, PlayerNotFoundError } from './player.errors';

const player: Player = {
  id: 52,
  firstName: 'Novak',
  lastName: 'Djokovic',
  shortName: 'N.DJO',
  sex: 'M',
  picture: null,
  country: { code: 'SRB', picture: 'https://tenisu.latelier.co/resources/Serbie.png' },
  data: { rank: 2, points: 2542, weight: 80000, height: 188, age: null, last: [1, 1, 1, 1, 1] },
};

describe('PlayerService', () => {
  let repository: jest.Mocked<PlayerRepository>;
  let countryRepository: jest.Mocked<CountryRepository>;
  let service: PlayerService;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<PlayerRepository>;
    countryRepository = {
      exists: jest.fn(),
    } as unknown as jest.Mocked<CountryRepository>;
    countryRepository.exists.mockResolvedValue(true);
    service = new PlayerService(repository, countryRepository);
  });

  describe('getAll', () => {
    it('delegates to the repository and returns its result', async () => {
      repository.findAll.mockResolvedValue([player]);

      const result = await service.getAll();

      expect(result).toEqual([player]);
    });
  });

  describe('getById', () => {
    it('delegates to the repository with the given id', async () => {
      repository.findById.mockResolvedValue(player);

      const result = await service.getById(52);

      expect(repository.findById).toHaveBeenCalledWith(52);
      expect(result).toEqual(player);
    });

    it('throws PlayerNotFoundError when the repository finds nothing', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getById(999999)).rejects.toThrow(PlayerNotFoundError);
    });
  });

  describe('create', () => {
    it('delegates to the repository when the country exists', async () => {
      const input = { firstName: 'Serena', countryCode: 'USA' } as CreatePlayerInput;
      repository.create.mockResolvedValue(player);

      const result = await service.create(input);

      expect(countryRepository.exists).toHaveBeenCalledWith('USA');
      expect(repository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(player);
    });

    it('throws CountryNotFoundError without inserting when the country does not exist', async () => {
      const input = { firstName: 'Serena', countryCode: 'XXX' } as CreatePlayerInput;
      countryRepository.exists.mockResolvedValue(false);

      await expect(service.create(input)).rejects.toThrow(CountryNotFoundError);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });
});
