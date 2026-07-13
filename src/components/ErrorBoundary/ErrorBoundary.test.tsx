import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './ErrorBoundary';

afterEach(cleanup);

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('boom');
  return <div>safe content</div>;
}

describe('ErrorBoundary', () => {
  it('renders children normally when nothing throws', () => {
    render(
      <ErrorBoundary label="Test Module">
        <div>all good</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('catches a render error from a child and shows the fallback UI instead of a blank screen', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary label="Test Module">
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/TEST MODULE/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /réessayer/i })).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('retry button re-attempts rendering children once the underlying cause is fixed', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();

    function Wrapper({ shouldThrow }: { shouldThrow: boolean }) {
      return (
        <ErrorBoundary label="Test Module">
          <Bomb shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );
    }

    const { rerender } = render(<Wrapper shouldThrow={true} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Parent re-renders with the fix in place, but the boundary still shows the
    // fallback until the user explicitly retries (it doesn't auto-recover).
    rerender(<Wrapper shouldThrow={false} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /réessayer/i }));
    expect(screen.getByText('safe content')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('exposes a "navigate home" action when provided, and calls it', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();

    render(
      <ErrorBoundary label="Test Module" onNavigateHome={onNavigateHome} homeLabel="Back home">
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: /back home/i }));
    expect(onNavigateHome).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('clears a caught error automatically when resetKey changes', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(
      <ErrorBoundary label="Test Module" resetKey="a">
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(
      <ErrorBoundary label="Test Module" resetKey="b">
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('safe content')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
