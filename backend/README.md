# Coverage
![Coverage Badge](https://raw.githubusercontent.com/KarlComSe/SvenskaElsparkcyklarAB/badges/backend/backend/coverage/badge.svg)
*(Generated with GitHub Actions!)*

# Backend

This is the backend of the project. It is built with [NestJS](https://nestjs.com/), a JS framework running on Node.js with good built-in TypeScript support, running on top of Express. 

It utilizes [Swagger](https://swagger.io/) for the API, which follows [OpenAPI](https://swagger.io/resources/open-api/) specification.

## Development setup

### With docker compose

```bash
docker compose -f docker-compose-dev.yml up --build
```

**Prereq:**
* Docker and Docker Compose
* Parent directory cloned
* Copy .env.example to .env
 * Fill in relevant values
 * Never commit .env files

**Start the dev server:**
* `docker compose -f docker-compose-dev.yml up --build`

Server is now available at http://localhost:3535, debug port 9229.

**Features:**
* Hot reload enabled

### With npm run 

**Prereq:** 
* Node 18+
* SQLite3
* Parent directory cloned
* Copy .env.example to .env
 * Fill in relevant values
 * Never commit .env files

```bash
# install packages
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### On .env

See parent-folder README for .env considerations.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage (combined)
$ npm run test:full-cov
```