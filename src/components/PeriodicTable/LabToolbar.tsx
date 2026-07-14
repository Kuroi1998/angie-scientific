import React, { useState } from 'react';
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
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  zoomLevel,
  setZoomLevel
}) => {
  const [showFilters, setShowFilters] = useState(false);
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

  return (
    <div className="lab-command-deck">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Left: Search & Filter Toggle */}
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px', alignItems: 'center' }}>
          <div className="lab-command-input-container">
            <span className="lab-command-prefix">{">_"}</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('toolbar.searchPlaceholderExtended')}
              className="lab-command-input"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lab-action-btn ${showFilters ? 'active' : ''}`}
          >
            <Filter size={14} />
            {t('toolbar.filtersBtn')}
          </button>
        </div>

        {/* Right: Tools & Modes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="lab-action-btn"
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
            title={t('toolbar.zoomOut', 'Zoom out')}
          >
            <ZoomOut size={16} />
          </button>
          
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          
          <button
            className="lab-action-btn"
            onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
            title={t('toolbar.zoomIn', 'Zoom in')}
          >
            <ZoomIn size={16} />
          </button>

          <button
            className="lab-action-btn"
            onClick={() => setZoomLevel(1)}
            title={t('toolbar.resetZoom', 'Reset zoom')}
          >
            <Maximize size={16} />
          </button>

          <button
            className="lab-quiz-btn"
            onClick={() => notifyApp({
              message: t('toolbar.quizComingSoon'),
              title: t('header.quiz'),
              tone: 'info'
            })}
          >
            <PlayCircle size={16} />
            {t('header.quiz')}
          </button>
        </div>
      </div>

      {/* Active Filters Panel */}
      {showFilters && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '6px',
          border: '1px solid rgba(0, 243, 255, 0.2)',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Famille chimique
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="lab-select"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              État physique
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="lab-select"
            >
              <option value="all">Tous les états</option>
              <option value="solid">Solide</option>
              <option value="liquid">Liquide</option>
              <option value="gas">Gaz</option>
              <option value="synthetic">Synthétique</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
