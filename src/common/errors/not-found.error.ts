import { HttpError } from './http-error';

export class NotFoundError extends HttpError {
  readonly statusCode = 404;
}
