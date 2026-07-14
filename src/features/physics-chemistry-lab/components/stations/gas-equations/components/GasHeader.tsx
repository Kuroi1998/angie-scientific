import React from 'react';


export const GasHeader: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--as-border-inverse)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--as-font-title)', color: 'var(--as-text-primary)', fontSize: '20px' }}>
          Équations d'état des gaz
        </h2>
        <span style={{ color: 'var(--as-text-muted)', fontSize: '12px' }}>
          Comparaison temps réel entre le modèle de gaz parfait et le modèle de Van der Waals.
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid var(--as-border-inverse)',
            color: 'var(--as-text-primary)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--as-font-title)',
            fontSize: '11px',
            transition: 'all 0.2s'
          }}
        >
          RÉINITIALISER
        </button>
      </div>
    </div>
  );
};
