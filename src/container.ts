import { AwilixContainer, InjectionMode, asClass, createContainer } from 'awilix';
import { PlayerController } from './players/player.controller';
import { PlayerService } from './players/player.service';
import { PlayerRepository } from './players/player.repository';
import { StatisticController } from './statistics/statistic.controller';
import { StatisticService } from './statistics/statistic.service';
import { StatisticRepository } from './statistics/statistic.repository';

interface Cradle {
  playerRepository: PlayerRepository;
  playerService: PlayerService;
  playerController: PlayerController;
  statisticRepository: StatisticRepository;
  statisticService: StatisticService;
  statisticController: StatisticController;
}

const container: AwilixContainer<Cradle> = createContainer<Cradle>({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  playerRepository: asClass(PlayerRepository).singleton(),
  playerService: asClass(PlayerService).singleton(),
  playerController: asClass(PlayerController).singleton(),
  statisticRepository: asClass(StatisticRepository).singleton(),
  statisticService: asClass(StatisticService).singleton(),
  statisticController: asClass(StatisticController).singleton(),
});

export { container };
