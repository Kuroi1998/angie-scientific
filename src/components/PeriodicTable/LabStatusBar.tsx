import React from 'react';
import { Wifi, Keyboard } from 'lucide-react';

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
  return React.createElement('div', { className: 'lab-status-bar' },
    // Left: Elements count and filters
    React.createElement('div', { className: 'lab-status-left' },
      React.createElement('span', null, `ÉLÉMENTS VISIBLES : ${visibleCount}/${totalCount}`),
      activeFilters.length > 0 && React.createElement('span', { className: 'lab-filter-active' }, `FILTRES ACTIFS: ${activeFilters.join(' | ')}`)
    ),

    // Right: Zoom, Network, Keyboard Help
    React.createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
      React.createElement('span', null, `ZOOM : ${(zoomLevel * 100).toFixed(0)}%`),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
        React.createElement(Keyboard, { size: 12 }),
        React.createElement('span', null, "TAPEZ / POUR CHERCHER")
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neon-green)' } },
        React.createElement(Wifi, { size: 12 }),
        React.createElement('span', null, "EN LIGNE")
      )
    )
  );
};
