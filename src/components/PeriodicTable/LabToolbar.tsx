import React from 'react';
import { Filter, ZoomIn, ZoomOut, Maximize, PlayCircle } from 'lucide-react';
import { notifyApp } from '../../utils/appNotifications';
import { useLanguage } from '../../hooks/useLanguage';

interface LabToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  zoomLevel: number;
  setZoomLevel: (z: number) => void;
}

export const LabToolbar: React.FC<LabToolbarProps> = ({

interface LabToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  zoomLevel: number;
  setZoomLevel: (z: number) => void;
}

export const LabToolbar: React.FC<LabToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  zoomLevel,
  setZoomLevel
}) => {
  const [showFilters, setShowFilters] = React.useState(false);
  const { t } = useLanguage('periodicTable');

  const categories = [
    { id: 'all', label: t('toolbar.categories.all') },
    { id: 'alkali-metal', label: t('toolbar.categories.alkali-metal') },
    { id: 'alkaline-earth', label: t('toolbar.categories.alkaline-earth') },
    { id: 'transition-metal', label: t('toolbar.categories.transition-metal') },
    { id: 'lanthanide', label: t('toolbar.categories.lanthanide') },
    { id: 'actinide', label: t('toolbar.categories.actinide') },
    { id: 'post-transition-metal', label: t('toolbar.categories.post-transition-metal') },
    { id: 'metalloid', label: t('toolbar.categories.metalloid') },
    { id: 'reactive-nonmetal', label: t('toolbar.categories.reactive-nonmetal') },
    { id: 'noble-gas', label: t('toolbar.categories.noble-gas') }
  ];

  return React.createElement('div', { className: 'lab-command-deck' },
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }
    },
      // Left: Search & Filter Toggle
      React.createElement('div', { style: { display: 'flex', gap: '12px', flex: 1, minWidth: '300px', alignItems: 'center' } },
        React.createElement('div', { className: 'lab-command-input-container' },
          React.createElement('span', { className: 'lab-command-prefix' }, ">_"),
          React.createElement('input', {
            type: 'text',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: t('toolbar.searchPlaceholderExtended'),
            className: 'lab-command-input'
          })
        ),
        React.createElement('button', {
          onClick: () => setShowFilters(!showFilters),
          className: `lab-action-btn ${showFilters ? 'active' : ''}`
        },
          React.createElement(Filter, { size: 14 }),
          t('toolbar.filtersBtn')
        )
      ),

      // Right: Tools & Modes
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
        React.createElement('button', {
          className: 'lab-quiz-btn',
          onClick: () => notifyApp({
            message: t('toolbar.quizComingSoon'),
            title: t('header.quiz'),
            tone: 'info'
          })
        },
    ),

    // Active Filters Panel
    showFilters && React.createElement('div', {
      style: {
        marginTop: '16px',
        padding: '16px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '6px',
        border: '1px solid rgba(0, 243, 255, 0.2)',
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
      }
    },
      React.createElement('div', null,
        React.createElement('label', { style: { display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' } }, "Famille chimique"),
        React.createElement('select', {
          value: selectedCategory,
          onChange: (e) => setSelectedCategory((e.target as HTMLSelectElement).value),
          className: 'lab-select'
        }, categories.map(c => React.createElement('option', { key: c.id, value: c.id }, c.label)))
      ),
      React.createElement('div', null,
        React.createElement('label', { style: { display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' } }, "État physique"),
        React.createElement('select', {
          value: selectedState,
          onChange: (e) => setSelectedState((e.target as HTMLSelectElement).value),
          className: 'lab-select'
        },
          React.createElement('option', { value: 'all' }, "Tous les états"),
          React.createElement('option', { value: 'solid' }, "Solide"),
          React.createElement('option', { value: 'liquid' }, "Liquide"),
          React.createElement('option', { value: 'gas' }, "Gaz"),
          React.createElement('option', { value: 'synthetic' }, "Synthétique")
        )
      )
    )
  );
};
