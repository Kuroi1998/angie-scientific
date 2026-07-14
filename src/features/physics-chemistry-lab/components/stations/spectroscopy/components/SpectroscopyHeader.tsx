import React from 'react';

export const SpectroscopyHeader: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--as-border-inverse)' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)', fontSize: '20px' }}>
        Spectrométrie & Analyse Optique
      </h2>
      <span style={{ color: 'var(--as-text-muted)', fontSize: '12px', maxWidth: '600px' }}>
        Analysez les signatures lumineuses des atomes (Spectres d'émission dans le visible) et les modes de vibration des molécules (Spectres d'absorption infrarouge). Survolez les spectres avec la souris pour activer le capteur de photons.
      </span>
    </div>
  );
};
