import { Request, Response } from 'express';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { Player } from './player.model';
import { CreatePlayerInput } from './player.schema';
import { PlayerNotFoundError } from './player.errors';

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

function mockResponse(): jest.Mocked<Response> {
  const res = { locals: {} } as unknown as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('PlayerController', () => {
  let service: jest.Mocked<PlayerService>;
  let controller: PlayerController;
  let res: jest.Mocked<Response>;

  beforeEach(() => {
    service = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<PlayerService>;
    controller = new PlayerController(service);
    res = mockResponse();
  });

  describe('getAll', () => {
    it('responds with the players returned by the service', async () => {
      service.getAll.mockResolvedValue([player]);

      await controller.getAll({} as Request, res);

      expect(res.json).toHaveBeenCalledWith([player]);
    });
  });

  describe('getById', () => {
    it('responds with the player when found', async () => {
      service.getById.mockResolvedValue(player);
      res.locals.params = { id: 52 };

      await controller.getById({} as Request, res);

      expect(service.getById).toHaveBeenCalledWith(52);
      expect(res.json).toHaveBeenCalledWith(player);
    });

    it('propagates errors from the service instead of swallowing them', async () => {
      service.getById.mockRejectedValue(new PlayerNotFoundError(999999));
      res.locals.params = { id: 999999 };

      await expect(controller.getById({} as Request, res)).rejects.toThrow(PlayerNotFoundError);
    });
  });

  describe('create', () => {
    it('responds 201 with the created player', async () => {
      service.create.mockResolvedValue(player);
      res.locals.body = { firstName: 'Serena' } as CreatePlayerInput;

      await controller.create({} as Request, res);

      expect(service.create).toHaveBeenCalledWith({ firstName: 'Serena' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(player);
    });

    it('propagates errors from the service instead of swallowing them', async () => {
      service.create.mockRejectedValue(new Error('db down'));
      res.locals.body = { firstName: 'Serena' } as CreatePlayerInput;

      await expect(controller.create({} as Request, res)).rejects.toThrow('db down');
    });
  });
});
