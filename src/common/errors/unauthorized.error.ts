import { HttpError } from './http-error';

export class UnauthorizedError extends HttpError {
  readonly statusCode = 401;
}
