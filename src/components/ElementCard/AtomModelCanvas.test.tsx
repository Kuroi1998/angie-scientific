import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { AtomModelCanvas } from './AtomModelCanvas';

afterEach(cleanup);

describe('AtomModelCanvas', () => {
  it('mounts without crashing given shells and a CSS-var category color', () => {
    const { container } = render(
      <AtomModelCanvas shells={[2, 8, 1]} categoryColor="var(--neon-magenta)" symbol="Na" />
    );
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('exposes an accessible label describing the atom', () => {
    const { container } = render(
      <AtomModelCanvas shells={[2, 1]} categoryColor="var(--neon-cyan)" symbol="Li" />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas?.getAttribute('role')).toBe('img');
    expect(canvas?.getAttribute('aria-label')).toContain('Li');
  });

  it('unmounts cleanly (no crash cancelling the animation frame / resize listener)', () => {
    const { unmount } = render(
      <AtomModelCanvas shells={[2, 8, 8, 1]} categoryColor="#00f3ff" symbol="K" />
    );
    expect(() => unmount()).not.toThrow();
  });

  it('re-renders without crashing when props change', () => {
    const { rerender, container } = render(
      <AtomModelCanvas shells={[2]} categoryColor="var(--neon-yellow)" symbol="He" />
    );
    rerender(<AtomModelCanvas shells={[2, 8]} categoryColor="var(--neon-green)" symbol="Ne" />);
    expect(container.querySelector('canvas')).toBeTruthy();
  });
});
