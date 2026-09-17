import { BadRequestError, NotFoundError } from '../common/errors';

export class PlayerNotFoundError extends NotFoundError {
  constructor(id: number) {
    super(`Player with id ${id} not found`);
  }
}

export class CountryNotFoundError extends BadRequestError {
  constructor(countryCode: string) {
    super(`Country with code ${countryCode} does not exist`);
  }
}
