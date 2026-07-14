# Development Guide

## Prerequisites

- Node.js 20 or newer is recommended.
- npm.
- A modern browser for local and Playwright checks.

## Frontend Setup

```bash
npm install
npm run dev
```

The frontend defaults to `http://localhost:5173/`.

## Optional Backend Setup

```bash
cd server
npm install
npm run dev
```

The backend defaults to `http://localhost:3001/` and creates a local SQLite
database outside version control.

## Validation

Run these before opening a pull request when the frontend changes:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

When the optional backend changes:

```bash
cd server
npm run typecheck
```

## Source Size Rule

Manually maintained source files should stay at or below 300 lines. Split files
by responsibility instead of compressing code. Generated files, lockfiles and
dependency folders are excluded from this rule.

## Documentation Rule

Update README or docs when a change affects:

- Public modules or workflows.
- Scripts or setup instructions.
- Theme IDs or visual behavior.
- Translation namespaces.
- Angie Mascot behavior.
- Security or environment configuration.
