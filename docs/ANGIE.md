# Angie Mascot

Angie is the local mascot experience in Angie Scientific. It is designed to make
the application feel guided without depending on a remote AI service.

## Current Implementation

- `src/components/Mascot/AngieMascot.tsx` renders the mascot UI.
- `src/components/Mascot/MascotContext.tsx` stores visibility, emotion and the
  active message.
- `src/components/Mascot/useMascot.ts` exposes mascot actions to components.
- `src/services/Educational/MascotMessageService.ts` contains local contextual
  message behavior.

## Capabilities

- Show contextual messages.
- Switch mascot emotion state.
- Play a notification sound when enabled.
- Respect profile preferences for mascot and sound behavior.
- Work with reduced-motion preferences through the broader app profile.

## Limits

- Angie does not call a remote AI API in this repository.
- Messages are local strings or local service responses.
- No secrets or model credentials are required.

## Development Notes

- Keep mascot copy friendly and concise.
- Add translations when mascot text becomes user-facing in both languages.
- Avoid blocking core workflows with mascot UI.
- Do not introduce a network AI integration without explicit configuration,
  security review and documentation.
