import { useLanguage } from '../../hooks/useLanguage';
import { ZoomableContainer } from './ZoomableContainer';
import { ElementTile } from './ElementTile';
import {
  getCategoryColor,
  getElementName,
  getGridPosition,
} from './periodicTableModel';
import type { ElementType, PeriodicMode } from './periodicTableTypes';

export type { ElementType } from './periodicTableTypes';

export interface TableGridProps {
  elements: ElementType[];
  favoriteSymbols: string[];
  matchesFilters: (element: ElementType) => boolean;
  mode: PeriodicMode;
  onSelectElement: (element: ElementType) => void;
  selectedElement: ElementType | null;
  setHoveredElement: (element: ElementType | null) => void;
  setZoomLevel: (value: number | ((previous: number) => number)) => void;
  zoomLevel: number;
}

export function TableGrid({
  elements,
  favoriteSymbols,
  matchesFilters,
  mode,
  onSelectElement,
  selectedElement,
  setHoveredElement,
  setZoomLevel,
  zoomLevel,
}: TableGridProps) {
  const { language } = useLanguage();

  return (
    <div className="pt-grid-shell">
      <ZoomableContainer scale={zoomLevel} onScaleChange={setZoomLevel}>
        <div className="pt-periodic-grid" aria-label="Tableau periodique">
          {elements.map((element) => {
            const active = matchesFilters(element);
            const name = getElementName(element, language);
            return (
              <ElementTile
                categoryColor={getCategoryColor(element.cat)}
                element={element}
                gridPosition={getGridPosition(element.n)}
                isActive={active}
                isFavorite={favoriteSymbols.includes(element.s)}
                isQuizMode={mode === 'quiz'}
                isSelected={selectedElement?.n === element.n}
                key={element.n}
                name={name}
                onBlur={() => active && setHoveredElement(null)}
                onClick={() => active && onSelectElement(element)}
                onFocus={() => active && setHoveredElement(element)}
                onMouseEnter={() => active && setHoveredElement(element)}
                onMouseLeave={() => active && setHoveredElement(null)}
              />
            );
          })}
          <SeriesPlaceholder column={3} row={6} label="57-71" />
          <SeriesPlaceholder column={3} row={7} label="89-103" />
        </div>
      </ZoomableContainer>
    </div>
  );
}

function SeriesPlaceholder({
  column,
  label,
  row,
}: {
  column: number;
  label: string;
  row: number;
}) {
  return (
    <div
      className="pt-series-placeholder"
      style={{ gridColumn: column, gridRow: row }}
    >
      {label}
    </div>
  );
}
