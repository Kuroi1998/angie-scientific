import React, { useState } from 'react';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';

export const FormulaPanel: React.FC = () => {
  const [detailed, setDetailed] = useState(false);

  return (
    <ScientificPanel title="Modèles Mathématiques" variant="glass">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <button
          onClick={() => setDetailed(!detailed)}
          style={{
            background: 'transparent',
            border: '1px solid var(--as-border-inverse)',
            color: 'rgba(247, 250, 252, 0.7)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontFamily: 'var(--as-font-title)',
            cursor: 'pointer'
          }}
        >
          {detailed ? 'VUE SIMPLE' : 'VUE DÉTAILLÉE'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: 'var(--surface-card)', padding: '12px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)', fontFamily: 'var(--as-font-title)' }}>LOI DES GAZ PARFAITS</h4>
          <div style={{ fontSize: '16px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', marginBottom: '8px', textAlign: 'center' }}>
            P × V = n × R × T
          </div>
          {detailed && (
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--as-text-muted)' }}>
              <li><strong>P</strong> : Pression (Pa ou bar)</li>
              <li><strong>V</strong> : Volume (m³ ou L)</li>
              <li><strong>n</strong> : Quantité de matière (mol)</li>
              <li><strong>R</strong> : Constante universelle (8.314 J/mol·K ou 0.08314 L·bar/mol·K)</li>
              <li><strong>T</strong> : Température absolue (K)</li>
            </ul>
          )}
        </div>

        <div style={{ background: 'var(--surface-card)', padding: '12px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'color-mix(in srgb, var(--as-accent-magenta) 75%, var(--as-text-primary) 25%)', fontFamily: 'var(--as-font-title)' }}>ÉQUATION DE VAN DER WAALS</h4>
          <div style={{ fontSize: '16px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', marginBottom: '8px', textAlign: 'center' }}>
            (P + a·(n/V)²) × (V - n·b) = n × R × T
          </div>
          {detailed && (
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--as-text-muted)' }}>
              <li><strong>a</strong> : Terme de cohésion (attractions intermoléculaires)</li>
              <li><strong>b</strong> : Covolume (volume propre exclu par les molécules)</li>
              <li>Cette équation corrige les deux hypothèses principales du gaz parfait (volume ponctuel et absence d'interactions).</li>
            </ul>
          )}
        </div>
      </div>
    </ScientificPanel>
  );
};
