import React from 'react';

interface AdvancedSliderProps {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (val: number) => void;
  disabled?: boolean;
  accentColor?: string;
}

export const AdvancedSlider: React.FC<AdvancedSliderProps> = ({
  label, symbol, value, min, max, step, unit, onChange, disabled = false, accentColor = 'var(--as-accent-cyan)'
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: disabled ? 0.5 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--as-font-title)', fontSize: '11px', color: 'var(--as-text-secondary)' }}>
          {label} ({symbol})
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            value={Number.isFinite(value) ? Number(value.toFixed(2)) : ''}
            min={min} max={max} step={step}
            disabled={disabled}
            onChange={(e) => onChange(parseFloat(e.target.value) || min)}
            style={{
              width: '60px',
              background: 'transparent',
              border: `1px solid var(--as-border-inverse)`,
              color: 'var(--text-primary)',
              fontFamily: 'var(--as-font-mono)',
              fontSize: '12px',
              padding: '2px 4px',
              borderRadius: '4px',
              textAlign: 'right'
            }}
          />
          <span style={{ fontFamily: 'var(--as-font-mono)', fontSize: '11px', color: 'var(--as-text-muted)' }}>{unit}</span>
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min} max={max} step={step}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--as-text-muted)' }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
