import { Request, Response } from 'express';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { StatisticsSummary } from './statistic.model';

const summary: StatisticsSummary = {
  topCountryByWinRatio: { code: 'SRB', picture: 'https://tenisu.latelier.co/resources/Serbie.png', winRatio: 0.8 },
  averageBmi: 22.4,
  medianHeight: 182.5,
};

function mockResponse(): jest.Mocked<Response> {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('StatisticController', () => {
  let service: jest.Mocked<StatisticService>;
  let controller: StatisticController;
  let res: jest.Mocked<Response>;

  beforeEach(() => {
    service = {
      getSummary: jest.fn(),
    } as unknown as jest.Mocked<StatisticService>;
    controller = new StatisticController(service);
    res = mockResponse();
  });

  describe('getSummary', () => {
    it('responds with the summary returned by the service', async () => {
      service.getSummary.mockResolvedValue(summary);

      await controller.getSummary({} as Request, res);

      expect(res.json).toHaveBeenCalledWith(summary);
    });

    it('propagates errors from the service instead of swallowing them', async () => {
      service.getSummary.mockRejectedValue(new Error('db down'));

      await expect(controller.getSummary({} as Request, res)).rejects.toThrow('db down');
    });
  });
});
