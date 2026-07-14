import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Settings, Bookmark, Trophy, Database } from 'lucide-react';
import { SettingsModal } from '../SettingsModal';
import { ThemeStoreModal } from '../ThemeStoreModal';

interface LabHeaderProps {
  discoveredCount: number;
  totalElements: number;
}

export const LabHeader: React.FC<LabHeaderProps> = ({ discoveredCount, totalElements }) => {
  const { t, language } = useLanguage();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showThemeStore, setShowThemeStore] = React.useState(false);
  
  let rank = "Explorateur";
  if (language === 'es') rank = "Explorador";

  return React.createElement('div', { className: 'lab-header' },
    // Left: Title & Subtitle
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } },
      React.createElement('h1', {
        style: {
          margin: 0,
          fontSize: '18px',
          fontFamily: 'var(--font-title)',
          color: 'var(--neon-cyan)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }
      }, "Tableau Périodique Interactif"),
      React.createElement('span', {
        style: {
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)'
        }
      }, `${discoveredCount} ${t('stats.discovered')} sur ${totalElements} • Niveau ${rank}`)
    ),

    // Right: Shortcuts & Sync
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
      // Sync State
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' } },
        React.createElement(Database, { size: 12 }),
        "SYNC OK"
      ),
      
      // Shortcuts
      React.createElement('div', { style: { display: 'flex', gap: '8px' } },
        React.createElement('button', { className: 'btn-icon', title: 'Thèmes & Personnalisation', onClick: () => setShowThemeStore(true) },
          React.createElement(Trophy, { size: 16 })
        ),
        React.createElement('button', { className: 'btn-icon', title: 'Favoris' },
          React.createElement(Bookmark, { size: 16 })
        ),
        React.createElement('button', { className: 'btn-icon', title: 'Paramètres', onClick: () => setShowSettings(true) },
          React.createElement(Settings, { size: 16 })
        )
      )
    ),

    showSettings && React.createElement(SettingsModal, { onClose: () => setShowSettings(false) }),
    showThemeStore && React.createElement(ThemeStoreModal, { onClose: () => setShowThemeStore(false) })
  );
};
