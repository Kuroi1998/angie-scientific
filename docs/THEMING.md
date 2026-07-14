# Theming

Themes are implemented with a React provider, persistent storage and CSS custom
properties.

## Theme IDs

- `system`
- `light`
- `dark`
- `scientific-night`
- `laboratory`
- `high-contrast`

`system` resolves to `light` or `dark` from the browser color-scheme
preference. The current theme choice is stored with the
`angie-scientific-theme` key.

## Key Files

- `src/theme/ThemeProvider.tsx`
- `src/theme/theme.constants.ts`
- `src/theme/theme.storage.ts`
- `src/theme/themes/*.theme.css`
- `src/styles/new-ui-tokens.css`
- `src/components/ThemeStoreModal.tsx`
- `src/theme/components/ThemeToggle.tsx`

## UI Expectations

- New UI must remain readable in light and dark modes.
- Scientific canvases should resolve CSS colors before using canvas APIs.
- Reduced motion preferences should be respected for animated experiences.
- New user-facing labels should be added in French and Spanish where relevant.
