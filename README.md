# openbci-cyton-brainhack

Node.js + PostgreSQL (Docker) starter for OpenBCI Cyton + Daisy experiments.

## Prerequisites

- [pnpm](https://pnpm.io/) 9+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running locally

## Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Start PostgreSQL via Docker Compose (exposes the database on `localhost:5433` by default):
   ```bash
  docker compose up -d
   ```
  > Need a different host port? Set `POSTGRES_HOST_PORT` (for Docker) and `POSTGRES_PORT` (for the app) before running the commands above.
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Run database migrations (when added) and start the dev server:
   ```bash
   pnpm dev
   ```

The API listens on `http://localhost:3000` by default. Check health:
```bash
curl http://localhost:3000/api/health
```

## Scripts

- `pnpm dev` – start the server with live reload
- `pnpm build` – compile the TypeScript source into `dist/`
- `pnpm start` – run the compiled output
- `pnpm test` – execute Jest unit tests
- `pnpm lint` – run ESLint checks
- `pnpm format` – apply Prettier formatting

## Project Structure

```
src/
  app.ts           # Express app factory
  index.ts         # Entry point bootstrapping database + HTTP server
  config/
    env.ts         # Environment variable parsing
    data-source.ts # TypeORM DataSource definition
  entities/
    BrainwaveSession.ts
  routes/
    health.ts
    index.ts
  __tests__/
    health.test.ts
```

## Next Steps

- Add more TypeORM entities matching your data model.
- Define migrations in `src/migrations/` (configure `AppDataSource` accordingly).
- Integrate OpenBCI Cyton data ingestion logic.
