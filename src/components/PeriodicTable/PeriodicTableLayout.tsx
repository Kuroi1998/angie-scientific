import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { useUserProgress } from '../useUserProgress';
import elementsData from '../../engines/data/elements.json';
import { ElementComparisonStrip } from './ElementComparisonStrip';
import { ElementSidePanel } from './ElementSidePanel';
import { PeriodicTableHeader } from './PeriodicTableHeader';
import { PeriodicTableLegend } from './PeriodicTableLegend';
import { PeriodicTableStatus } from './PeriodicTableStatus';
import { PeriodicTableToolbar } from './PeriodicTableToolbar';
import { TableGrid } from './TableGrid';
import {
  matchesElementFilters,
} from './periodicTableModel';
import type {
  ElementType,
  PeriodicFilters,
  PeriodicMode,
} from './periodicTableTypes';
import './periodic-table.css';
import './periodic-table-panels.css';

interface PeriodicTableLayoutProps {
  onAddToFusion?: (element: ElementType) => void;
}

const defaultFilters: PeriodicFilters = {
  category: 'all',
  query: '',
  state: 'all',
};

const isStringArray = (raw: unknown): raw is string[] =>
  Array.isArray(raw) && raw.every((item) => typeof item === 'string');

export function PeriodicTableLayout({ onAddToFusion }: PeriodicTableLayoutProps) {
  const { language } = useLanguage();
  const { progress } = useUserProgress();
  const elements = elementsData as ElementType[];
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);
  const [, setHoveredElement] = useState<ElementType | null>(null);
  const [filters, setFilters] = useState<PeriodicFilters>(defaultFilters);
  const [mode, setMode] = useState<PeriodicMode>('explore');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [comparison, setComparison] = useState<ElementType[]>([]);
  const [favoriteSymbols, setFavoriteSymbols] = useLocalStorageState<string[]>(
    'favoriteElements',
    [],
    { validate: isStringArray },
  );

  const matchesFilters = (element: ElementType) =>
    matchesElementFilters(element, filters, language);
  const visibleCount = elements.filter(matchesFilters).length;
  const activeFilterCount = [
    filters.query,
    filters.category !== 'all' ? filters.category : '',
    filters.state !== 'all' ? filters.state : '',
  ].filter(Boolean).length;

  const toggleFavorite = (symbol: string) => {
    setFavoriteSymbols((current) =>
      current.includes(symbol)
        ? current.filter((item) => item !== symbol)
        : [...current, symbol],
    );
  };

  const addComparison = (element: ElementType) => {
    setComparison((current) => {
      const next = current.filter((item) => item.s !== element.s);
      return [...next, element].slice(-2);
    });
  };

  return (
    <div className="pt-page">
      <PeriodicTableHeader
        discoveredCount={progress?.discoveredElements.length ?? 0}
        mode={mode}
        onToggleMode={() => setMode((value) => (value === 'quiz' ? 'explore' : 'quiz'))}
        totalElements={elements.length}
      />
      <PeriodicTableToolbar
        filters={filters}
        language={language}
        onFiltersChange={setFilters}
        resultCount={visibleCount}
      />
      <PeriodicTableLegend language={language} />
      <ElementComparisonStrip
        elements={comparison}
        onClear={() => setComparison([])}
      />
      <div className="pt-workspace">
        <TableGrid
          elements={elements}
          favoriteSymbols={favoriteSymbols}
          matchesFilters={matchesFilters}
          mode={mode}
          onSelectElement={setSelectedElement}
          selectedElement={selectedElement}
          setHoveredElement={setHoveredElement}
          setZoomLevel={setZoomLevel}
          zoomLevel={zoomLevel}
        />
        {selectedElement && (
          <ElementSidePanel
            element={selectedElement}
            isFavorite={favoriteSymbols.includes(selectedElement.s)}
            onAddToFusion={onAddToFusion}
            onClose={() => setSelectedElement(null)}
            onCompare={addComparison}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>
      <PeriodicTableStatus
        activeFilterCount={activeFilterCount}
        selectedSymbol={selectedElement?.s}
        visibleCount={visibleCount}
        zoomLevel={zoomLevel}
      />
    </div>
  );
}
