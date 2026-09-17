import { HttpError } from './http-error';

export class BadRequestError extends HttpError {
  readonly statusCode = 400;
}
