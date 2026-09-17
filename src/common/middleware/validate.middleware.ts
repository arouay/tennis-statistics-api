import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';

type RequestPart = 'params' | 'body' | 'query';

export function validate<T>(part: RequestPart, schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      res.status(400).json({ message: formatZodError(result.error) });
      return;
    }
    res.locals[part] = result.data;
    next();
  };
}

function formatZodError(error: ZodError): string {
  return error.issues[0]?.message ?? 'Invalid request';
}
