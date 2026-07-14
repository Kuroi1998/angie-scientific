import React, { useState } from 'react';
import { ScientificPanel } from '../../../components/shared/ScientificPanel';
import { FormulaDisplay } from '../../../components/shared/FormulaDisplay';
import { getFormulaText } from '../services/wavefunctionCalculations';
import type { OrbitalDef } from '../services/wavefunctionCalculations';
import { useLanguage } from '../../../hooks/useLanguage';

interface OrbitalInfoPanelProps {
  orbital: OrbitalDef;
}

export const OrbitalInfoPanel: React.FC<OrbitalInfoPanelProps> = ({ orbital }) => {
  const { t } = useLanguage();
  const [advanced, setAdvanced] = useState(false);

  const angularNodes = orbital.l;
  const radialNodes = orbital.n - orbital.l - 1;

  const formula = getFormulaText(orbital.n, orbital.l, orbital.m);

  return (
    <ScientificPanel
      title={t('info.title', { ns: 'quantum' })}
      variant="secondary"
      actions={
        <div style={{ display: 'flex', gap: '4px', background: 'var(--as-surface-3)', borderRadius: '4px', padding: '2px' }}>
          <button
            onClick={() => setAdvanced(false)}
            style={{
              padding: '4px 8px', fontSize: '10px', borderRadius: '2px', border: 'none', cursor: 'pointer',
              background: !advanced ? 'var(--as-surface-inverse)' : 'transparent',
              color: !advanced ? 'var(--as-text-inverse)' : 'var(--as-text-muted)'
            }}
          >
            {t('info.simple', { ns: 'quantum' })}
          </button>
          <button
            onClick={() => setAdvanced(true)}
            style={{
              padding: '4px 8px', fontSize: '10px', borderRadius: '2px', border: 'none', cursor: 'pointer',
              background: advanced ? 'var(--as-surface-inverse)' : 'transparent',
              color: advanced ? 'var(--as-text-inverse)' : 'var(--as-text-muted)'
            }}
          >
            {t('info.advanced', { ns: 'quantum' })}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--as-text-muted)', textTransform: 'uppercase' }}>{t('info.orbital', { ns: 'quantum' })}</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--as-text-primary)', fontWeight: 'bold' }}>
            {orbital.label}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--as-text-muted)', textTransform: 'uppercase' }}>{t('info.relativeEnergy', { ns: 'quantum' })}</div>
          <div style={{ fontSize: '16px', fontFamily: 'var(--as-font-mono)', color: 'var(--as-accent-amber)' }}>
            E ∝ -1/{Math.pow(orbital.n, 2)}
          </div>
        </div>
      </div>

      {!advanced ? (
        <div style={{ color: 'var(--as-text-primary)', fontSize: '14px', lineHeight: '1.5' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            {t('info.desc1', { ns: 'quantum', label: orbital.label })}
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            {t('info.desc2_base', { ns: 'quantum', n: orbital.n })} {orbital.l === 0 ? t('info.desc2_s', { ns: 'quantum' }) : orbital.l === 1 ? t('info.desc2_p', { ns: 'quantum' }) : t('info.desc2_d', { ns: 'quantum' })}
          </p>
          <p style={{ margin: 0, color: 'var(--as-text-muted)' }}>
            {t('info.desc3', { ns: 'quantum' })}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormulaDisplay 
            name={t('info.waveFunction', { ns: 'quantum', n: orbital.n, l: orbital.l, m: orbital.m })}
            formula={formula} 
            description={t('info.waveFunctionDesc', { ns: 'quantum' })}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'var(--as-surface-2)', padding: '8px', borderRadius: '4px', border: '1px solid var(--as-border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{t('info.radialNodes', { ns: 'quantum' })}</div>
              <div style={{ fontSize: '18px', fontFamily: 'var(--as-font-mono)', color: 'var(--as-text-primary)' }}>{radialNodes}</div>
            </div>
            <div style={{ background: 'var(--as-surface-2)', padding: '8px', borderRadius: '4px', border: '1px solid var(--as-border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--as-text-muted)' }}>{t('info.angularNodes', { ns: 'quantum' })}</div>
              <div style={{ fontSize: '18px', fontFamily: 'var(--as-font-mono)', color: 'var(--as-text-primary)' }}>{angularNodes}</div>
            </div>
          </div>
        </div>
      )}
    </ScientificPanel>
  );
};
