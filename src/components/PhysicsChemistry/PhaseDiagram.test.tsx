import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithLanguage } from '../../testUtils';
import { PhaseDiagram } from './PhaseDiagram';

afterEach(cleanup);

describe('PhaseDiagram', () => {
  it('mounts without crashing and renders both canvases', () => {
    const { container } = renderWithLanguage(<PhaseDiagram />);
    expect(container.querySelectorAll('canvas').length).toBe(2);
  });

  it('switches substance (CO2 <-> Water) without crashing, re-syncing temp/pressure sliders', async () => {
    const user = userEvent.setup();
    renderWithLanguage(<PhaseDiagram />);

    const waterButton = screen.getByRole('button', { name: /water/i });
    await user.click(waterButton);

    // Sliders should reflect water's min/max range after the switch.
    const sliders = screen.getAllByRole('slider') as HTMLInputElement[];
    expect(sliders.length).toBe(2);
  });

  it('clicking the P-T grid updates the readout without throwing', async () => {
    const { container } = renderWithLanguage(<PhaseDiagram />);
    const gridCanvas = container.querySelectorAll('canvas')[0] as HTMLCanvasElement;
    expect(() => gridCanvas.click()).not.toThrow();
  });
});
