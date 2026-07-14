import React from 'react';
import { useLanguage } from '../../../../../../hooks/useLanguage';

export const PhaseHeader: React.FC = () => {
  const { t } = useLanguage('lab');

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--as-border-inverse)', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--as-font-title)', color: 'var(--text-primary)', fontSize: '20px' }}>
          {t('phase.header.title')}
        </h2>
        <span style={{ color: 'var(--as-text-muted)', fontSize: '12px', maxWidth: '600px' }}>
          {t('phase.header.desc')}
        </span>
      </div>
    </div>
  );
};
