import { Request, Response } from 'express';
import { z } from 'zod';
import { validate } from './validate.middleware';

const schema = z.object({
  id: z.coerce.number({ error: 'Invalid id' }).int({ error: 'Invalid id' }).positive({ error: 'Invalid id' }),
});

function mockResponse(): jest.Mocked<Response> {
  const res = { locals: {} } as unknown as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('validate', () => {
  let res: jest.Mocked<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    res = mockResponse();
    next = jest.fn();
  });

  it('calls next and stores the parsed data on res.locals when valid', () => {
    const req = { params: { id: '52' } } as unknown as Request;

    validate('params', schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.locals.params).toEqual({ id: 52 });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responds 400 and does not call next when invalid', () => {
    const req = { params: { id: 'abc' } } as unknown as Request;

    validate('params', schema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid id' });
  });
});
