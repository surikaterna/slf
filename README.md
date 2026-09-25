# SLF Monorepo

Simple Logging Facade packages and drivers maintained in one repository.

## Packages

| Package                                         | Description                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`slf`](./packages/slf/README.md)               | Core logging facade and logger factory used by all drivers.                        |
| [`slf-debug`](./packages/slf-debug/README.md)   | Driver that forwards SLF events to [`debug`](https://www.npmjs.com/package/debug). |
| [`slf-sentry`](./packages/slf-sentry/README.md) | Driver for sending SLF events to Sentry, with optional debug fan-out.              |

## Requirements

- Node.js 18+
- npm 10+

## Install dependencies

```bash
npm install
```

## Workspace scripts

```bash
npm run test
npm run build
npm run dev
npm run lint
npm run format
npm run check-style
npm run check-style:ci
```

- `build`: Run package builds through Turbo (`turbo run build`)
- `dev`: Run package watch builds through Turbo (`turbo run dev --parallel`)

## Changesets and versioning

This repository uses `@changesets/cli`.

For changes that need a release, create a changeset and commit it with your changes:

```bash
npm run changeset
```

After the PR is merged into `develop`, the [Changesets workflow](./.github/workflows/changesets.yml) creates or updates a version PR. Merging that PR publishes the new versions to npm and creates package tags and releases on GitHub. Do not run the version or publish scripts as part of your PR.

Changesets config lives in [`.changeset/config.json`](./.changeset/config.json).
