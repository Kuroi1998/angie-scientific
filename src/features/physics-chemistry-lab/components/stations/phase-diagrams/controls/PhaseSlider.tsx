import React from 'react';

interface PhaseSliderProps {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  isLogScale?: boolean;
  onChange: (val: number) => void;
  accentColor?: string;
}

export const PhaseSlider: React.FC<PhaseSliderProps> = ({
  label, symbol, value, min, max, step, unit, isLogScale = false, onChange, accentColor = 'var(--as-accent-cyan)'
}) => {
  // If log scale, the slider moves between log10(min) and log10(max)
  const sliderMin = isLogScale ? Math.log10(min) : min;
  const sliderMax = isLogScale ? Math.log10(max) : max;
  const sliderVal = isLogScale ? Math.log10(value) : value;
  const sliderStep = isLogScale ? (sliderMax - sliderMin) / 1000 : step;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    const realVal = isLogScale ? Math.pow(10, v) : v;
    onChange(realVal);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!Number.isNaN(v)) {
      onChange(Math.max(min, Math.min(max, v)));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--as-font-title)', fontSize: '11px', color: 'var(--as-text-secondary)' }}>
          {label} ({symbol}) {isLogScale && '(Log Scale)'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            value={Number.isFinite(value) ? Number(value.toPrecision(4)) : ''}
            min={min} max={max} step={step}
            onChange={handleTextChange}
            style={{
              width: '80px',
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
        value={sliderVal}
        min={sliderMin} max={sliderMax} step={sliderStep}
        onChange={handleChange}
        style={{ width: '100%', accentColor }}
      />
    </div>
  );
};
