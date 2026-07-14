# Changelog

This project follows a Keep a Changelog style where practical. Versions are not
tagged yet, so current work is listed under `Unreleased`.

## [Unreleased]

### Added

- New app shell documentation, screenshots and GitHub project README.
- Documentation for architecture, development, themes, i18n and Angie Mascot.
- Contribution and security guides.
- GitHub issue templates and pull request template.
- Quality workflow for frontend checks and optional backend type-checking.
- Optional `.env.example` with non-sensitive local configuration examples.
- Physics-chemistry feature modules for gases, kinetics, phase diagrams and
  spectroscopy.
- Quantum visualizer feature module with orbital, hybridization and Heisenberg
  views.
- User center, theme gallery, progress panels and discovery album views.

### Changed

- Rebuilt the interface around lazy-loaded modules and a shared app shell.
- Replaced the old global CSS entry points with design tokens, theme files and
  feature-scoped styles.
- Split oversized scientific components and helpers to keep maintained source
  files under the 300-line project limit.
- Expanded FR/ES localization with i18next namespaces.
- Updated the optional backend package so its SQLite wrapper dependency is
  declared and it has usable development/type-check scripts.
- Strengthened GitHub Pages deploy checks with lint, type-check and tests.

### Fixed

- Corrected outdated README claims about React, TypeScript and test counts.
- Corrected visible encoding issues in page metadata, theme labels, PWA
  description and selected console messages.
- Removed misleading documentation for features, commands and test totals that
  no longer matched the repository.

### Security

- Audited common secret patterns and environment files before preparing the
  branch for push.
- Added ignore rules for local environment files, generated databases, reports,
  caches and temporary visual artifacts.
- `npm audit --audit-level=moderate` reports 0 vulnerabilities for the frontend
  package and the optional backend package.

## 2026-07-13 - stabilization branch

### Fixed

- Resolved canvas color/font issues caused by unresolved CSS variables.
- Removed unsafe equation HTML rendering and replaced it with typed JSX formula
  rendering.
- Improved small-screen overflow behavior.
- Added error boundaries around high-risk scientific modules.

### Added

- Vitest, React Testing Library and Playwright coverage for critical paths.
- Local storage migration and persistence helpers.
- Accessibility improvements for dialogs, tabs, canvases, status regions and
  keyboard navigation.

### Changed

- Added `typecheck`, `test`, `test:watch` and `test:e2e` scripts.
- Configured the Vite base path for GitHub Pages.
