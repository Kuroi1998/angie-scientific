import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../../hooks/useLanguage';
import { AngieChatPanel } from '../components/AngieChatPanel';
import { AngieProvider } from '../state/AngieProvider';
import { useAngie } from '../state/useAngie';
import type { AngieSituation } from '../context/situation.types';

vi.mock('../../../components/useUserProgress', () => ({
  useUserProgress: () => ({
    profile: { mascotEnabled: true, mascotSoundEnabled: false },
  }),
}));

vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})));

afterEach(cleanup);

const situation: AngieSituation = {
  currentTab: 'home',
  language: 'fr',
  theme: 'dark',
  learningLevel: 'discovery',
  discoveredElementsCount: 0,
  successfulReactionsCount: 0,
  solvedRiddlesCount: 0,
  unlockedBadgesCount: 0,
  completedQuestsCount: 0,
  experiencePoints: 0,
  isFirstVisit: false,
  sessionStartedAt: 0,
  mascotEnabled: true,
  reducedMotion: false,
};

function Harness() {
  const { openPanel, state, closePanel } = useAngie();
  return (
    <>
      <button onClick={openPanel}>open</button>
      <AngieChatPanel isOpen={state.isPanelOpen} onClose={closePanel} situation={situation} />
    </>
  );
}

function renderPanel() {
  return render(
    <LanguageProvider>
      <AngieProvider>
        <Harness />
      </AngieProvider>
    </LanguageProvider>,
  );
}

describe('AngieChatPanel', () => {
  it('shows the empty state before any message is sent', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('open'));
    expect(await screen.findByText(/Pose une question/i)).toBeInTheDocument();
  });

  it('sends a user message and receives a reply from the intent engine', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('open'));

    const input = await screen.findByPlaceholderText(/Ecris ta question/i);
    await user.type(input, 'merci');
    await user.click(screen.getByRole('button', { name: 'Envoyer' }));

    expect(await screen.findByText('merci')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Avec plaisir/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('fires a quick action and shows a contextual reply', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('open'));

    await user.click(await screen.findByRole('button', { name: 'Explique cette page' }));

    await waitFor(() => {
      expect(screen.getByText('Explique cette page')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getAllByRole('log')[0].textContent).toMatch(/tableau de bord|activite/i);
    }, { timeout: 2000 });
  });

  it('closes when the close button is activated', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('open'));
    await screen.findByText(/Discuter avec Angie/i);

    await user.click(screen.getByRole('button', { name: /Fermer la conversation/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Discuter avec Angie/i)).not.toBeInTheDocument();
    });
  });
});
