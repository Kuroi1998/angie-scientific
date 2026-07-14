import React from 'react';
import { Wifi, Keyboard } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface LabStatusBarProps {
  visibleCount: number;
  totalCount: number;
  zoomLevel: number;
  activeFilters: string[];
}

export const LabStatusBar: React.FC<LabStatusBarProps> = ({
  visibleCount,
  totalCount,
  zoomLevel,
  activeFilters
}) => {
  const { t } = useLanguage('periodicTable');
  return React.createElement('div', { className: 'lab-status-bar' },
    // Left: Elements count and filters
    React.createElement('div', { className: 'lab-status-left' },
      React.createElement('span', null, t('status.visibleCount', { visible: visibleCount, total: totalCount })),
      activeFilters.length > 0 && React.createElement('span', { className: 'lab-filter-active' }, t('status.activeFilters', { filters: activeFilters.join(' | ') }))
    ),

    // Right: Zoom, Network, Keyboard Help
    React.createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
      React.createElement('span', null, t('status.zoom', { level: (zoomLevel * 100).toFixed(0) })),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
        React.createElement(Keyboard, { size: 12 }),
        React.createElement('span', null, t('status.typeToSearch'))
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neon-green)' } },
        React.createElement(Wifi, { size: 12 }),
        React.createElement('span', null, t('status.online'))
      )
    )
  );
};
