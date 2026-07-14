import React from 'react';
import type { SpectroscopyMode } from '../types/spectroscopy.types';

interface ModeSelectorProps {
  mode: SpectroscopyMode;
  onModeChange: (mode: SpectroscopyMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
      <button
        onClick={() => onModeChange('EMISSION')}
        style={{
          padding: '8px 16px',
          background: mode === 'EMISSION' ? 'rgba(24, 184, 200, 0.15)' : 'transparent',
          border: `1px solid ${mode === 'EMISSION' ? 'var(--as-accent-cyan)' : 'var(--as-border-inverse)'}`,
          color: mode === 'EMISSION' ? 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)' : 'var(--as-text-muted)',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'var(--as-font-title)',
          fontSize: '13px',
          transition: 'all 0.2s'
        }}
      >
        ÉMISSION (VISIBLE)
      </button>

      <button
        onClick={() => onModeChange('ABSORPTION')}
        style={{
          padding: '8px 16px',
          background: mode === 'ABSORPTION' ? 'rgba(239, 107, 91, 0.15)' : 'transparent',
          border: `1px solid ${mode === 'ABSORPTION' ? 'var(--as-accent-amber)' : 'var(--as-border-inverse)'}`,
          color: mode === 'ABSORPTION' ? 'color-mix(in srgb, var(--as-accent-amber) 75%, var(--as-text-primary) 25%)' : 'var(--as-text-muted)',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'var(--as-font-title)',
          fontSize: '13px',
          transition: 'all 0.2s'
        }}
      >
        ABSORPTION (INFRAROUGE)
      </button>
    </div>
  );
};
