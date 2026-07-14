import React from 'react';

export const PhaseHeader: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--as-border-inverse)', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)', fontSize: '20px' }}>
          Diagrammes de Phase et Thermodynamique
        </h2>
        <span style={{ color: 'var(--as-text-muted)', fontSize: '12px', maxWidth: '600px' }}>
          Explorez les changements d'état de la matière en fonction de la température et de la pression (équation de Clausius-Clapeyron). Cliquez sur le diagramme P-T pour déplacer le point de fonctionnement.
        </span>
      </div>
    </div>
  );
};
