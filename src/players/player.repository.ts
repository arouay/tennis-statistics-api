import { Player } from './player.model';

export class PlayerRepository {
  findAll(): Player[] {
    return [{ id: 'placeholder' }];
  }
}
