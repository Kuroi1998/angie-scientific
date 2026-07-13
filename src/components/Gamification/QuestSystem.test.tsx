import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithLanguage } from '../../testUtils';
import { QuestSystem } from './QuestSystem';

afterEach(cleanup);
beforeEach(() => {
  window.localStorage.clear();
});

describe('QuestSystem', () => {
  it('mounts with zero completed quests and 0 points', () => {
    renderWithLanguage(<QuestSystem />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('toggling a quest checkbox marks it complete, updates points, and persists', async () => {
    const user = userEvent.setup();
    renderWithLanguage(<QuestSystem />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'false');

    await user.click(checkboxes[0]);
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'true');

    const stored = window.localStorage.getItem('angieScientific:v1:questProgress');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored as string).length).toBe(1);
  });

  it('restores previously completed quests from storage on mount', () => {
    window.localStorage.setItem('angieScientific:v1:questProgress', JSON.stringify(['halogens']));
    renderWithLanguage(<QuestSystem />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'true');
  });
});
