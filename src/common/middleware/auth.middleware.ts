import { NextFunction, Request, Response } from 'express';
import { JWTPayload, createRemoteJWKSet, jwtVerify } from 'jose';
import { UnauthorizedError } from '../errors';
import { keycloakConfig } from '../../config/keycloak';
import { container } from '../../container';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: JWTPayload;
  }
}

const BEARER_PREFIX = 'Bearer ';
const jwks = createRemoteJWKSet(new URL(keycloakConfig.jwksUrl));
const userRepository = container.resolve('userRepository');

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(BEARER_PREFIX.length);

  let payload: JWTPayload;
  try {
    ({ payload } = await jwtVerify(token, jwks, {
      issuer: keycloakConfig.issuer,
      audience: keycloakConfig.clientId,
    }));
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }

  if (!payload.sub || !(await userRepository.findByKeycloakId(payload.sub))) {
    throw new UnauthorizedError('User is not registered');
  }

  req.auth = payload;
  next();
}
