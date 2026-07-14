import type { CSSProperties } from 'react';
import { Badge } from '../../design-system';
import type { ElementType } from '../PeriodicTable/periodicTableTypes';

interface ElementDetailTitleProps {
  category: string;
  categoryColor: string;
  element: ElementType;
  name: string;
}

export function ElementDetailTitle({
  category,
  categoryColor,
  element,
  name,
}: ElementDetailTitleProps) {
  return (
    <span
      className="element-detail-title"
      style={{ '--element-accent': categoryColor } as CSSProperties}
    >
      <span className="element-detail-token" aria-hidden="true">
        <span>{element.n}</span>
        <strong>{element.s}</strong>
      </span>
      <span className="element-detail-title-copy">
        <span>{name}</span>
        <Badge tone="info">{category}</Badge>
      </span>
    </span>
  );
}
