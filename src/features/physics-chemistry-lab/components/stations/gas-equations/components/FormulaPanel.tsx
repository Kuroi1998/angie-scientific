import React, { useState } from 'react';
import { ScientificPanel } from '../../../../../../components/shared/ScientificPanel';
import { useLanguage } from '../../../../../../hooks/useLanguage';

export const FormulaPanel: React.FC = () => {
  const [showDetailed, setShowDetailed] = useState(false);
  const { t } = useLanguage('lab');

  return (
    <ScientificPanel title={t('gas.formulas.title')} variant="primary">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button 
          onClick={() => setShowDetailed(!showDetailed)}
          style={{
            background: 'transparent',
            border: '1px solid var(--as-border-inverse)',
            color: 'var(--as-text-primary)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          {showDetailed ? t('gas.formulas.simpleView') : t('gas.formulas.detailedView')}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Loi des Gaz Parfaits */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', color: 'var(--as-accent-cyan)', fontSize: '13px', fontFamily: 'var(--as-font-title)' }}>
            {t('gas.formulas.idealTitle')}
          </h4>
          <div style={{ padding: '16px', background: 'rgba(24, 184, 200, 0.05)', borderRadius: '8px', border: '1px solid var(--as-accent-cyan)', textAlign: 'center' }}>
            <span style={{ fontSize: '24px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)' }}>
              P · V = n · R · T
            </span>
          </div>
          {showDetailed && (
            <ul style={{ margin: '12px 0 0 0', paddingLeft: '20px', fontSize: '11px', color: 'var(--as-text-muted)', lineHeight: '1.6' }}>
              <li>{t('gas.formulas.idealP')}</li>
              <li>{t('gas.formulas.idealV')}</li>
              <li>{t('gas.formulas.idealN')}</li>
              <li>{t('gas.formulas.idealR')}</li>
              <li>{t('gas.formulas.idealT')}</li>
            </ul>
          )}
        </div>

        {/* Équation de Van der Waals */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', color: 'var(--as-accent-magenta)', fontSize: '13px', fontFamily: 'var(--as-font-title)' }}>
            {t('gas.formulas.vdwTitle')}
          </h4>
          <div style={{ padding: '16px', background: 'rgba(239, 107, 91, 0.05)', borderRadius: '8px', border: '1px solid var(--as-accent-magenta)', textAlign: 'center' }}>
            <span style={{ fontSize: '20px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)' }}>
              (P + a·n²/V²) · (V - n·b) = n · R · T
            </span>
          </div>
          {showDetailed && (
            <div style={{ marginTop: '12px' }}>
              <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '11px', color: 'var(--as-text-muted)', lineHeight: '1.6' }}>
                <li><strong style={{ color: 'var(--as-accent-magenta)' }}>{t('gas.formulas.vdwA')}</strong></li>
                <li><strong style={{ color: 'var(--as-accent-cyan)' }}>{t('gas.formulas.vdwB')}</strong></li>
              </ul>
              <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', padding: '8px', background: 'var(--surface-background)', borderRadius: '4px' }}>
                💡 {t('gas.formulas.vdwDesc')}
              </div>
            </div>
          )}
        </div>

      </div>
    </ScientificPanel>
  );
};
