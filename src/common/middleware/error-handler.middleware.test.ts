import { NextFunction, Request, Response } from 'express';
import { errorHandler } from './error-handler.middleware';
import { NotFoundError } from '../errors';

function mockResponse(headersSent = false): jest.Mocked<Response> {
  const res = { headersSent } as unknown as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
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

  it('maps an unknown error to a generic 500', () => {
    const res = mockResponse();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(new Error('db down'), {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });

    consoleErrorSpy.mockRestore();
  });

  it('delegates to next when headers were already sent', () => {
    const res = mockResponse(true);
    const err = new Error('too late');

    errorHandler(err, {} as Request, res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.status).not.toHaveBeenCalled();
  });
});
