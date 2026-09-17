import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';
import { Player } from './player.model';

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
  let service: PlayerService;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<PlayerRepository>;
    service = new PlayerService(repository);
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

    it('returns null when the repository finds nothing', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.getById(999999);

      expect(result).toBeNull();
    });
  });
});
