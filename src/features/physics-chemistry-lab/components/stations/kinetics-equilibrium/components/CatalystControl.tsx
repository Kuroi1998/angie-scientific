import React from 'react';

interface CatalystControlProps {
  catalystEaReduction: number;
  onChange: (val: number) => void;
  maxReduction: number;
}

export const CatalystControl: React.FC<CatalystControlProps> = ({ catalystEaReduction, onChange, maxReduction }) => {
  const isCatalyzed = catalystEaReduction > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: isCatalyzed ? 'rgba(57, 255, 20, 0.05)' : 'var(--surface-card)', border: `1px solid ${isCatalyzed ? 'var(--as-accent-green)' : 'var(--as-border-inverse)'}`, borderRadius: '8px', transition: 'all 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: isCatalyzed ? 'var(--as-accent-green)' : 'var(--as-text-muted)', fontFamily: 'var(--as-font-title)' }}>
          CATALYSEUR
        </span>
        <span style={{ fontSize: '10px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-mono)' }}>
          - {catalystEaReduction.toFixed(1)} kJ/mol
        </span>
      </div>
      
      <p style={{ margin: '0 0 8px 0', fontSize: '10px', color: 'var(--as-text-muted)' }}>
        Abaisse l'énergie d'activation sans modifier l'état final d'équilibre (accélère la réaction).
      </p>

      <input
        type="range"
        min={0} max={maxReduction} step={1}
        value={catalystEaReduction}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--as-accent-green)' }}
      />
    </div>
  );
};
