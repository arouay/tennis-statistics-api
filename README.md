# Tennis Statistics API

A REST API for managing tennis players and computing statistics (BMI, win ratio, median height) across a player roster. Built with Express, TypeScript and PostgreSQL, secured with Keycloak (OIDC/JWT).

## Tech stack

- **Runtime:** Node.js 22, TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL, [node-pg-migrate](https://github.com/salsita/node-pg-migrate) for migrations
- **Auth:** Keycloak (Bearer JWT, verified against the realm's JWKS via [jose](https://github.com/panva/jose))
- **Validation:** [Zod](https://zod.dev/)
- **DI:** [Awilix](https://github.com/jeffijoe/awilix)
- **Docs:** OpenAPI 3.1 generated from Zod schemas ([zod-openapi](https://github.com/samchungy/zod-openapi)), served via Swagger UI
- **Logging:** Pino (structured HTTP + error logs)
- **Testing:** Jest + SWC
- **Linting:** ESLint (flat config) + typescript-eslint

## Architecture

The codebase is organized by domain module (`players`, `statistics`, `countries`, `users`), each following a layered structure:

```
routes -> controller -> service -> repository -> database
```

- **routes** wire HTTP verbs/paths to controllers and apply request validation.
- **controllers** are thin HTTP adapters (parse request, call service, shape response).
- **services** hold business logic and orchestrate repositories.
- **repositories** are the only layer that talks to PostgreSQL.

Dependencies are wired through an Awilix container ([src/container.ts](src/container.ts)) rather than imported directly, which keeps each layer unit-testable in isolation.

## API

Routes below are as defined by the Express app (used as-is locally, e.g. `http://localhost:3000/players`). In production, Nginx exposes the whole app under an `/api` prefix, so the same route is reached at `https://tennis.arouay.com/api/players`.

All endpoints require a valid Keycloak Bearer token, except `/api-docs`. Interactive OpenAPI documentation (with request/response schemas) is served at:

```
GET /api-docs            # local
GET /api/api-docs        # production (behind Nginx)
```

| Method | Path            | Description                                              |
| ------ | --------------- | --------------------------------------------------------- |
| GET    | `/players`      | List all players with their country and stats             |
| GET    | `/players/:id`  | Get a single player by id                                  |
| POST   | `/players`      | Create a player (validates the country code exists)        |
| GET    | `/statistics`   | Aggregate stats: top country by win ratio, average BMI, median height |

Errors follow a consistent shape: `{ "message": string }`, with the relevant HTTP status code (`400`, `401`, `404`, `500`).

## Authentication

Authentication is delegated to Keycloak. The API expects an `Authorization: Bearer <token>` header on every request (except the docs). The token is verified against the realm's JWKS endpoint (issuer, audience and signature), and the token subject must match a user registered in the local `users` table — tokens from valid Keycloak users that haven't been provisioned in the database are rejected with `401`.

Configure the following environment variables to point at your Keycloak realm:

| Variable             | Description                                  |
| -------------------- | --------------------------------------------- |
| `KEYCLOAK_URL`       | Base URL of the Keycloak server               |
| `KEYCLOAK_REALM`     | Realm name                                    |
| `KEYCLOAK_CLIENT_ID` | Client ID used as the expected token audience |

### Getting a token

Get an access token from Keycloak (direct grant), using a user already registered in the local `users` table (see [seeds/users.seed.ts](seeds/users.seed.ts)):

```bash
curl --location 'https://keycloak.arouay.com/realms/tennis/protocol/openid-connect/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode 'username=<KEYCLOAK_USERNAME>' \
  --data-urlencode 'password=<KEYCLOAK_PASSWORD>' \
  --data-urlencode 'client_id=tennis-client'
```

The response contains an `access_token` — use it as a Bearer token on any API call:

```bash
curl --location --request GET 'https://tennis.arouay.com/api/statistics' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <ACCESS_TOKEN>'
```

## Getting started

### Prerequisites

- Node.js 22+
- Docker (for PostgreSQL, or the full stack)

### Setup

```bash
npm install
cp .env.example .env   # then fill in KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID
```

### Run the database

```bash
npm run db:up          # starts PostgreSQL in Docker
npm run migrate:up     # runs migrations
npm run seed           # seeds sample players/countries
npm run seed:users     # registers a Keycloak user id, required to pass auth
```

### Run the API

```bash
npm run dev             # dev server with hot reload (tsx watch)
# or
npm run build && npm start
```

The API listens on `PORT` (default `3000`). Swagger UI is available at `http://localhost:3000/api-docs`.

## Docker

The whole stack (API + PostgreSQL) can also be run with Docker Compose:

```bash
npm run docker:up      # builds and starts both containers
npm run docker:down    # stops them
```

The API container reads its configuration from `.env` (see `docker-compose.yml`); `DATABASE_URL` is overridden internally to point at the `postgres` service.

## Testing & linting

```bash
npm test          # run the test suite
npm run test:watch
npm run lint
npm run lint:fix
```

Unit tests cover controllers, services, repositories and shared middleware, using mocked dependencies so no database connection is required.

## Deployment

The API runs on a single server using the same `docker-compose.yml` as local development, behind Nginx (HTTPS via Let's Encrypt, exposed under an `/api` prefix at `tennis.arouay.com`). A single GitHub Actions pipeline, [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml), lints/builds/tests on every push and PR, then — only on push to `main` — builds the image, ships it to the server over SSH (no registry involved), and restarts the stack with migrations applied.

## Project structure

```
src/
  common/           # errors, middleware (auth, validation, logging, error handling)
  config/           # database and Keycloak configuration
  countries/        # country lookup used by players/statistics
  players/          # player CRUD
  statistics/       # aggregate statistics
  users/            # local user registry backing authentication
  openapi/          # OpenAPI document assembly
  container.ts      # Awilix DI container
  app.ts            # Express app wiring
  server.ts         # entry point
migrations/         # node-pg-migrate migrations
seeds/              # sample data seed scripts
```
