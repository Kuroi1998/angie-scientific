# Angie Scientific UI Direction - Phase 2

## Intent

The new Angie Scientific interface should feel like a calm research station for
young learners: precise, readable, tactile, and a little wondrous. It should
evoke a modern laboratory, orbital research deck, and advanced classroom without
leaning on loud neon, heavy darkness, or generic dashboard patterns.

## Product Principles

- Teach first: scientific data must remain readable before decoration.
- Invite exploration: discovery states should feel rewarding but not childish.
- Stay calm: animation supports feedback and orientation, never constant noise.
- Scale cleanly: every page should use shared tokens and reusable primitives.
- Preserve trust: warnings, safety notes, and progress must be obvious.

## Visual Direction

- Backgrounds: deep ink and cool graphite foundations with soft mineral light.
- Surfaces: layered lab glass, matte panels, and subtle grid discipline.
- Accent rhythm: cyan for science/action, amber for insight, coral for risk,
  violet for discovery, green for success.
- Shape language: compact 6px to 8px radii, crisp controls, no pill-heavy UI.
- Texture: very subtle measurement lines, spectra, and orbital traces only when
  they clarify context.
- Icons: lucide line icons at consistent stroke width, paired with labels only
  for primary navigation or complex actions.

## Palette

| Role | Token | Hex | Use |
| --- | --- | --- | --- |
| Space | `--as-bg-space` | `#080b12` | App background |
| Lab | `--as-bg-lab` | `#101720` | Main page bands |
| Surface | `--as-surface-1` | `#f7fafc` | Light elevated panel |
| Panel | `--as-surface-2` | `#eaf1f5` | Secondary panels |
| Text | `--as-text-strong` | `#10202a` | Primary text |
| Muted | `--as-text-muted` | `#5d6f7a` | Helper text |
| Cyan | `--as-accent-cyan` | `#18b8c8` | Primary action |
| Amber | `--as-accent-amber` | `#f2b84b` | Insight and highlights |
| Violet | `--as-accent-violet` | `#7c6ee6` | Discovery and badges |
| Coral | `--as-accent-coral` | `#ef6b5b` | Risk and errors |
| Green | `--as-accent-green` | `#39a76d` | Success |

## Typography

- Display: use Orbitron only for brand and short module labels.
- Body: Inter for all reading, forms, tables, and explanations.
- Mono: Share Tech Mono only for scientific readouts and coordinate labels.
- No negative letter spacing. Avoid viewport-scaled font sizes.
- Buttons and compact panels use normal casing where possible; all caps only for
  short telemetry labels.

## Layout

- Desktop: persistent left navigation plus dense, full-width work surfaces.
- Tablet: compact top bar with section tabs and collapsible contextual panels.
- Mobile: bottom or drawer navigation designed for thumb reach.
- Grids: use predictable tracks and minmax constraints to avoid overflow.
- Page sections: unframed bands, not cards inside cards.

## Component Tone

- Buttons: icon-led, clear state, minimum 44px touch target.
- Cards: reserved for repeated content or focused tools, max 8px radius.
- Panels: used for lab controls, data inspectors, and explanatory sidebars.
- Modals: focused tasks only, with visible close, Escape, and focus handling.
- Data tables: dense, scannable, sortable, with sticky headers where useful.
- Empty states: direct next action plus a small scientific hint.

## Motion

- Page transitions under 180ms.
- Control feedback under 120ms.
- Success reactions may use a short 400ms burst.
- No permanent glow loops except active simulation indicators.
- `prefers-reduced-motion` and app reduced motion setting must disable
  decorative motion.

## Accessibility

- Contrast target: WCAG AA for text, AAA for critical warnings when possible.
- Focus ring: visible 2px ring with offset on every interactive element.
- All icon-only buttons need labels or tooltips.
- Canvas simulations need textual summaries and accessible labels.
- Error, success, and quiz time changes need screen-reader announcements.

## Responsive Rules

- 320px: single-column tools, horizontal table handled inside its viewport.
- 480px: compact controls, bottom navigation, reduced inspector density.
- 768px: two-column lab controls and previews where content allows.
- 1024px: persistent contextual side panels.
- 1280px and above: high-density layouts, max readable line lengths.
- Ultrawide: constrain content bands and avoid stretched text.

## Implementation Rules

- New visual values must come from `src/styles/new-ui-tokens.css`.
- Existing neon tokens remain legacy until replaced by phase-specific work.
- Do not import new tokens globally until a page or layout is rebuilt.
- Do not layer new CSS over obsolete visual classes as a long-term strategy.
- Any page refactor must remove its obsolete visual CSS once replacement works.
