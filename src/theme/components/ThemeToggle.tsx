import React from 'react';
import { Moon, Monitor, Sun } from 'lucide-react';
import { Dropdown } from '../../design-system';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

export const ThemeToggle: React.FC<{ onOpenThemeStore: () => void }> = ({ onOpenThemeStore }) => {
  const { theme, resolvedTheme, setTheme, availableThemes } = useTheme();
  const { t } = useLanguage('user');

  const handleToggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (theme === 'system') return <Monitor size={18} />;
    return resolvedTheme === 'dark' ? <Moon size={18} /> : <Sun size={18} />;
  };

  const items = [
    { label: t('themeSelector.quickToggle'), onSelect: handleToggle },
    ...availableThemes.map((themeOption) => ({
      label: `${themeOption.name} ${theme === themeOption.id ? '✓' : ''}`,
      onSelect: () => setTheme(themeOption.id)
    })),
    { label: t('themeSelector.openStore'), onSelect: onOpenThemeStore }
  ];

  return (
    <Dropdown
      variant="ghost"
      label={
        <span
          aria-label={t('themeSelector.toggleLabel')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          title={t('themeSelector.currentTheme', { theme })}
        >
          {getIcon()}
        </span>
      }
      items={items}
    />
  );
};
