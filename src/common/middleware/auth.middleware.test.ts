import { NextFunction, Request, Response } from 'express';

jest.mock('../../config/keycloak', () => ({
  keycloakConfig: {
    issuer: 'https://keycloak.test/realms/tennis',
    jwksUrl: 'https://keycloak.test/realms/tennis/protocol/openid-connect/certs',
    clientId: 'tennis-client',
  },
}));

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn().mockReturnValue('jwks-placeholder'),
  jwtVerify: jest.fn(),
}));

jest.mock('../../container', () => ({
  container: {
    resolve: jest.fn().mockReturnValue({ findByKeycloakId: jest.fn() }),
  },
}));

import { jwtVerify } from 'jose';
import { container } from '../../container';
import { authenticate } from './auth.middleware';
import { UnauthorizedError } from '../errors';

const mockedJwtVerify = jwtVerify as jest.Mock;
const mockedFindByKeycloakId = container.resolve('userRepository').findByKeycloakId;

function mockRequest(headers: Record<string, string> = {}): Request {
  return { headers } as unknown as Request;
}

describe('authenticate', () => {
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    next = jest.fn();
    mockedJwtVerify.mockReset();
    mockedFindByKeycloakId.mockReset();
  });

  it('throws UnauthorizedError when the Authorization header is missing', async () => {
    const req = mockRequest();

    await expect(authenticate(req, {} as Response, next)).rejects.toThrow(UnauthorizedError);
    expect(next).not.toHaveBeenCalled();
    expect(mockedJwtVerify).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedError when the header does not use the Bearer scheme', async () => {
    const req = mockRequest({ authorization: 'Basic abc123' });

    await expect(authenticate(req, {} as Response, next)).rejects.toThrow(UnauthorizedError);
    expect(mockedJwtVerify).not.toHaveBeenCalled();
  });

  it('attaches the decoded payload to req.auth and calls next when the token is valid and the user is registered', async () => {
    const payload = { sub: 'user-1', realm_access: { roles: ['user'] } };
    mockedJwtVerify.mockResolvedValue({ payload });
    mockedFindByKeycloakId.mockResolvedValue({ id: 1, email: 'test@tennis-api.local', keycloakId: 'user-1' });
    const req = mockRequest({ authorization: 'Bearer valid.token.here' });

    await authenticate(req, {} as Response, next);

    expect(mockedJwtVerify).toHaveBeenCalledWith(
      'valid.token.here',
      'jwks-placeholder',
      expect.objectContaining({ issuer: 'https://keycloak.test/realms/tennis', audience: 'tennis-client' }),
    );
    expect(mockedFindByKeycloakId).toHaveBeenCalledWith('user-1');
    expect(req.auth).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it('throws UnauthorizedError when the token is invalid or expired', async () => {
    mockedJwtVerify.mockRejectedValue(new Error('signature verification failed'));
    const req = mockRequest({ authorization: 'Bearer bad.token.here' });

    await expect(authenticate(req, {} as Response, next)).rejects.toThrow(UnauthorizedError);
    expect(next).not.toHaveBeenCalled();
    expect(mockedFindByKeycloakId).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedError when the token is valid but no local user matches the sub claim', async () => {
    mockedJwtVerify.mockResolvedValue({ payload: { sub: 'unknown-user' } });
    mockedFindByKeycloakId.mockResolvedValue(null);
    const req = mockRequest({ authorization: 'Bearer valid.token.here' });

    await expect(authenticate(req, {} as Response, next)).rejects.toThrow(UnauthorizedError);
    expect(next).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedError when the token has no sub claim', async () => {
    mockedJwtVerify.mockResolvedValue({ payload: {} });
    const req = mockRequest({ authorization: 'Bearer valid.token.here' });

    await expect(authenticate(req, {} as Response, next)).rejects.toThrow(UnauthorizedError);
    expect(mockedFindByKeycloakId).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
