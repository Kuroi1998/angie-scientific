# Contributing

Thanks for improving Angie Scientific. Keep changes small enough to review and
ground every claim in the repository.

## Workflow

1. Create a focused branch.
2. Install dependencies with `npm install`.
3. Make the change.
4. Add or update tests when behavior changes.
5. Run the relevant validation commands.
6. Open a pull request with screenshots for UI changes.

## Commit Style

Use short conventional prefixes when they fit:

- `feat:`
- `fix:`
- `refactor:`
- `test:`
- `docs:`
- `ci:`
- `chore:`

## Quality Rules

- Keep manually maintained source files at or below 300 lines.
- Do not hide file size by compressing unrelated statements onto one line.
- Prefer feature-scoped helpers over large multipurpose files.
- Keep French and Spanish user-facing text in sync.
- Check both light and dark themes for visible UI changes.
- Do not commit generated reports, local databases, screenshots in `artifacts/`
  or real `.env` files.

## Validation Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Optional backend when touched:

```bash
cd server
npm install
npm run typecheck
```
