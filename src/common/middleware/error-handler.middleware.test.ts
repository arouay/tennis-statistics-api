import { NextFunction, Request, Response } from 'express';
import { errorHandler } from './error-handler.middleware';
import { NotFoundError } from '../errors';

function mockResponse(headersSent = false): jest.Mocked<Response> {
  const res = { headersSent } as unknown as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockRequest(): Request {
  return { log: { error: jest.fn() } } as unknown as Request;
}

describe('errorHandler', () => {
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    next = jest.fn();
  });

  it('maps an HttpError to its status code and message', () => {
    const res = mockResponse();
    const err = new NotFoundError('Player with id 52 not found');

    errorHandler(err, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Player with id 52 not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('maps an unknown error to a generic 500 and logs it', () => {
    const res = mockResponse();
    const req = mockRequest();
    const err = new Error('db down');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(req.log.error).toHaveBeenCalledWith({ err }, 'Unhandled error');
  });

  it('delegates to next when headers were already sent', () => {
    const res = mockResponse(true);
    const err = new Error('too late');

    errorHandler(err, {} as Request, res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.status).not.toHaveBeenCalled();
  });
});
