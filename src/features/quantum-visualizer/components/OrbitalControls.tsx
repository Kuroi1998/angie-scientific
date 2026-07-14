import React from 'react';
import { ParameterSlider } from '../../../components/shared/ParameterSlider';
import { useLanguage } from '../../../hooks/useLanguage';

interface OrbitalControlsProps {
  n: number;
  l: number;
  m: number;
  viewMode: 'heatmap' | 'density' | 'phase';
  onUpdateNumbers: (n: number, l: number, m: number) => void;
  onSetViewMode: (mode: 'heatmap' | 'density' | 'phase') => void;
}

export const OrbitalControls: React.FC<OrbitalControlsProps> = ({
  n, l, m, viewMode, onUpdateNumbers, onSetViewMode
}) => {
  const { t } = useLanguage();
  const handleNChange = (val: number) => onUpdateNumbers(val, Math.min(l, val - 1), m);
  const handleLChange = (val: number) => onUpdateNumbers(n, val, Math.max(-val, Math.min(m, val)));
  const handleMChange = (val: number) => onUpdateNumbers(n, l, val);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ParameterSlider
        label={t('controls.nLabel', { ns: 'quantum' })}
        value={n} min={1} max={3} step={1}
        onChange={handleNChange}
        tooltip={t('controls.nTooltip', { ns: 'quantum' })}
      />
      
      <ParameterSlider
        label={t('controls.lLabel', { ns: 'quantum' })}
        value={l} min={0} max={n - 1} step={1}
        onChange={handleLChange}
        tooltip={t('controls.lTooltip', { ns: 'quantum' })}
      />
      
      <ParameterSlider
        label={t('controls.mLabel', { ns: 'quantum' })}
        value={m} min={-l} max={l} step={1}
        onChange={handleMChange}
        tooltip={t('controls.mTooltip', { ns: 'quantum' })}
      />

      <div style={{ marginTop: '12px' }}>
        <label style={{ fontSize: '12px', color: 'var(--as-text-inverse)', display: 'block', marginBottom: '8px' }}>
          {t('controls.viewMode', { ns: 'quantum' })}
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['heatmap', 'density', 'phase'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onSetViewMode(mode)}
              style={{
                flex: 1,
                padding: '6px',
                background: viewMode === mode ? 'rgba(24, 184, 200, 0.1)' : 'transparent',
                border: `1px solid ${viewMode === mode ? 'var(--as-accent-cyan)' : 'var(--as-border-inverse)'}`,
                // This sits on --as-surface-inverse, so it needs --as-text-inverse
                // (pairs with it in every theme) rather than --as-accent-cyan /
                // --as-text-subtle, neither of which reliably contrasts against
                // a background that flips brightness per theme.
                color: viewMode === mode ? 'var(--as-text-inverse)' : 'color-mix(in srgb, var(--as-text-inverse) 65%, transparent)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                textTransform: 'uppercase'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
