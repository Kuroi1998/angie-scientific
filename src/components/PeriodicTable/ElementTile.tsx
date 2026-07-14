import type { CSSProperties } from 'react';
import type { ElementType } from './periodicTableTypes';

interface ElementTileProps {
  categoryColor: string;
  element: ElementType;
  gridPosition: CSSProperties;
  isActive: boolean;
  isFavorite: boolean;
  isQuizMode: boolean;
  isSelected: boolean;
  name: string;
  onBlur: () => void;
  onClick: () => void;
  onFocus: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ElementTile({
  categoryColor,
  element,
  gridPosition,
  isActive,
  isFavorite,
  isQuizMode,
  isSelected,
  name,
  onBlur,
  onClick,
  onFocus,
  onMouseEnter,
  onMouseLeave,
}: ElementTileProps) {
  const className = [
    'pt-element-tile',
    isActive ? 'is-active' : 'is-muted',
    isSelected && 'is-selected',
    isFavorite && 'is-favorite',
    isQuizMode && 'is-quiz',
  ].filter(Boolean).join(' ');

  return (
    <div className="pt-element-slot" style={gridPosition}>
      <button
        aria-label={`${element.n} - ${name} (${element.s})`}
        className={className}
        disabled={!isActive}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ '--pt-category': categoryColor } as CSSProperties}
        type="button"
      >
        <span className="pt-element-number">{element.n}</span>
        <span className="pt-element-symbol">{element.s}</span>
        <span className="pt-element-name">{name}</span>
        {isFavorite && <span className="pt-element-favorite">*</span>}
      </button>
    </div>
  );
}
