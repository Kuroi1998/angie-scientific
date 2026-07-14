# Security Policy

## Supported Scope

The repository currently contains a frontend app and an optional local backend
prototype under `server/`. There is no published security support matrix yet.

## Reporting a Vulnerability

Please report vulnerabilities privately to the repository owner instead of
opening a public issue with exploit details. Include:

- A short summary.
- Steps to reproduce.
- Affected files, modules or routes.
- Impact and suggested mitigation when known.

## Secret Handling

- Do not commit `.env` files, private keys, certificates, database dumps or
  generated local SQLite files.
- Use `.env.example` for non-sensitive examples.
- If a secret is accidentally committed, revoke it before cleanup.
- Do not rewrite Git history without explicit maintainer approval.

## Local Checks

```bash
npm audit --audit-level=moderate
npm run lint
npm run typecheck
npm run test
npm run build
```
