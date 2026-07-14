import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../hooks/useLanguage';
import { isStorageAvailable } from '../../utils/localStorage';
import { QuizMode } from './QuizMode';

vi.mock('../Mascot/useMascot', () => ({
  useMascot: () => ({ showMessage: vi.fn(), setEmotion: vi.fn() }),
}));

vi.mock('../useUserProgress', () => ({
  useUserProgress: () => ({
    profile: { reducedMotion: true },
    progress: { solvedRiddles: [] },
    solveRiddle: vi.fn(),
  }),
}));

afterEach(cleanup);
beforeEach(() => {
  window.localStorage.clear();
});

function renderQuiz() {
  return render(
    <LanguageProvider>
      <QuizMode />
    </LanguageProvider>,
  );
}

describe('QuizMode', () => {
  it('starts a training session and validates an answer', async () => {
    const user = userEvent.setup();
    renderQuiz();

    await user.click(screen.getByRole('button', { name: /Commencer/i }));
    expect(screen.getByText(/Question 1/i)).toBeInTheDocument();

    const answers = screen.getAllByRole('button').filter((button) =>
      button.className.includes('quiz-answer'),
    );
    await user.click(answers[0]);
    await user.click(screen.getByRole('button', { name: /Valider/i }));

    expect(screen.getByText(/Bonne reponse|Mauvaise reponse/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continuer/i })).toBeInTheDocument();
  });

  it('opens the riddle mode from the mode selection screen', async () => {
    const user = userEvent.setup();
    renderQuiz();

    await user.click(screen.getByRole('button', { name: /Devinettes/i }));
    expect(screen.getByText(/Devinette active/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
  });

  it('shows a save error when local history cannot be persisted', async () => {
    const user = userEvent.setup();
    expect(isStorageAvailable()).toBe(true);
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });

    try {
      renderQuiz();
      await user.click(screen.getByRole('button', { name: /Commencer/i }));
      await user.click(screen.getByRole('button', { name: /Interrompre/i }));

      expect(await screen.findByText(/Erreur d'enregistrement/i)).toBeInTheDocument();
    } finally {
      setItemSpy.mockRestore();
    }
  });
});
