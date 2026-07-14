import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const { t } = useLanguage('user');

  return (
    <div className="as-theme-selector">
      <h3 style={{ margin: '0 0 1rem 0', color: 'var(--as-text-primary)' }}>{t('themeSelector.title')}</h3>
      <p style={{ color: 'var(--as-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {t('themeSelector.description')}
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {availableThemes.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            style={{
              padding: '1rem',
              borderRadius: 'var(--as-radius-2)',
              border: `2px solid ${theme === t.id ? 'var(--as-border-focus)' : 'var(--as-border-soft)'}`,
              background: 'var(--as-surface-1)',
              color: 'var(--as-text-primary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all var(--as-duration-fast) ease',
              position: 'relative'
            }}
          >
            {theme === t.id && (
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                color: 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)'
              }}>
                ✓
              </div>
            )}
            <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {t.type === 'auto' ? '💻' : t.type === 'dark' ? '🌙' : '☀️'} {t.name}
              {t.isPremium && <span style={{ fontSize: '0.7rem', padding: '2px 4px', background: 'var(--as-accent-amber-soft)', color: 'color-mix(in srgb, var(--as-accent-amber) 60%, black 40%)', borderRadius: '4px' }}>PRO</span>}
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--as-text-muted)' }}>
              {t.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
