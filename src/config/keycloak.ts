import dotenv from 'dotenv';

dotenv.config();

const keycloakUrl = process.env.KEYCLOAK_URL;
const realm = process.env.KEYCLOAK_REALM;
const clientId = process.env.KEYCLOAK_CLIENT_ID;

if (!keycloakUrl || !realm || !clientId) {
  throw new Error('Missing Keycloak configuration: KEYCLOAK_URL, KEYCLOAK_REALM and KEYCLOAK_CLIENT_ID are required');
}

const issuer = `${keycloakUrl}/realms/${realm}`;

export const keycloakConfig = {
  issuer,
  jwksUrl: `${issuer}/protocol/openid-connect/certs`,
  clientId,
};
