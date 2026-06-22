# A Note-Taking Back-End Application Project

## Description

A note-taking back-end application personal project. Inspired by Google Keep.

## Technology Stack

Below are the main technologies used in this project:

- Node.js (a JavaScript runtime): [https://github.com/nodejs/node](https://github.com/nodejs/node)
- TypeScript: [https://github.com/microsoft/TypeScript](https://github.com/microsoft/TypeScript)

## Framework & Library

Below are the core frameworks and libraries used in this project:

- Fastify (a Node.js web framework): [https://github.com/fastify/fastify](https://github.com/fastify/fastify)
- TypeBox (a JSON Schema Type Builder for TypeScript): [https://github.com/sinclairzx81/typebox](https://github.com/sinclairzx81/typebox)
- Pino (a JavaScript logger): [https://github.com/pinojs/pino](https://github.com/pinojs/pino)
- Prisma ORM (an ORM for Node.js & TypeScript): [https://github.com/prisma/prisma](https://github.com/prisma/prisma)
- Better Auth (a comprehensive auth for TypeScript): [https://github.com/better-auth/better-auth](https://github.com/better-auth/better-auth)
- Vitest (a JavaScript testing framework): [https://github.com/vitest-dev/vitest](https://github.com/vitest-dev/vitest)
- Dotenv (a JavaScript ENVs loader): [https://github.com/motdotla/dotenv](https://github.com/motdotla/dotenv)
- undici (an HTTP/1.1 client): [https://github.com/nodejs/undici](https://github.com/nodejs/undici)

## Utility & Tool

Below are the core utilities and tools used in this project:

- tsx (a TypeScript executor): [https://github.com/privatenumber/tsx](https://github.com/privatenumber/tsx)
- cross-env (a platform agnostic ENVs setter): [https://github.com/kentcdodds/cross-env](https://github.com/kentcdodds/cross-env)

## Specifications

Below are the specifications that are used in this project:

- [Node.js](https://github.com/fastify/fastify) with version 24 LTS or higher
- [pnpm](https://github.com/pnpm/pnpm) with version 11 or higher

## Configuration

### Environment Variables

All required environment variables are hinted in the `.env.example` file. They can be set by creating a `.env.production` file for production mode, a `.env.development` file for development mode, and a `.env.ci` file for CI mode (if they do not already exist) and setting them within it. Or, ENVs can be set in the system-wide environment variables directly on the host machine.

## API Specification Implementation

The project implements the API specification, which is defined in the `apiSpec.yaml` file. It's stored in the [gkeep-clone-restful-api-spec](https://github.com/codewithsyahda/gkeep-clone-restful-api-spec) repository.

## Getting Started

### Dependencies Installation

```sh
pnpm install # or `pnpm i`
```

### Prototyping Database Schema

The command below is syncing the latest Prisma Schema to the database schema **without** creating a migration file.

```sh
pnpm dlx prisma db push
```

> Please note that the `prisma db push` command should be used only in the local development environment.

### Database Migration

The command below is creating a migration file, followed by syncing the updated Prisma Schema to the database schema.

```sh
pnpm dlx prisma migrate dev --name my-first-migration
```

> Please note that the `prisma migrate dev` command is used only in the local development environment.

### Production Database Migration

The Prisma team states that the `prisma migrate deploy` commmand should generally be part of an automated CI/CD pipeline, and they do not recommend running this command locally to deploy changes to a production database.

### Code Quality

```sh
# For TypeScript type-checking
pnpm typecheck

# For linting all source code files
pnpm lint

# For checking all source code files that should be formatted
pnpm format:c

# For formatting all source code files
pnpm format:w
```

### Development

```sh
pnpm dev # or `pnpm dev:w` with watch mode
```

> Make sure to set all the required environment variables first before running in development mode. See the [environment variables configuration](#environment-variables) section.

## Testing

### Running Unit and Integration Testing

The commands below will run unit and integration testing with coverage mode by default.

```sh
pnpm test:ci # or `pnpm test:w` with watch mode
```

### Running E2E Testing

To support E2E testing between a front-end project and this backend project, with [Playwright](https://github.com/microsoft/playwright) (for example), this backend project should run two applications. The first is the real backend, and the second is the backend helper.

Before running the two backend applications, provide the required environment variables in the `.env.ci` file (create it in this project first if it doesn't exist) or in the system-wide environment variable. The required environment variables are hinted at in the `.env.example` file.

Execute the command below to run the real backend:

```sh
pnpm build && pnpm start:e2e
```

Open a second terminal and run the command below to run the backend helper:

```sh
pnpm dev:e2e
```

The `pnpm start:e2e` and `pnpm dev:e2e` commands will use the same `.env.ci` file by default (if it exists).

The backend helper is created to manage the state of the database tables during E2E testing. For example, resets all database tables on every E2E test case scenario.

## Building for Production

Create a production build:

```sh
pnpm build
```

After building the application, you can start the built application by running the following command:

```sh
pnpm start
```

> Make sure to set all the required environment variables first before running the built application. See the [environment variables configuration](#environment-variables) section.

## License

[MIT License](./LICENSE.txt) © 2026-present Syahda Romansyah.
