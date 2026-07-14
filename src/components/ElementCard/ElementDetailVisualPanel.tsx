import type { CSSProperties } from 'react';
import { Bot, Orbit } from 'lucide-react';
import { Alert } from '../../design-system';
import { AtomModelCanvas } from './AtomModelCanvas';
import type { ElementType } from '../PeriodicTable/periodicTableTypes';

interface ElementDetailVisualPanelProps {
  categoryColor: string;
  element: ElementType;
  fact: string;
  mascotEnabled: boolean;
}

export function ElementDetailVisualPanel({
  categoryColor,
  element,
  fact,
  mascotEnabled,
}: ElementDetailVisualPanelProps) {
  return (
    <section
      className="element-detail-visual"
      style={{ '--element-accent': categoryColor } as CSSProperties}
      aria-label="Simulation atomique"
    >
      <div className="element-detail-visual-label">
        <Orbit size={16} aria-hidden="true" />
        <span>Bohr simulation</span>
      </div>
      <div className="element-detail-canvas">
        <AtomModelCanvas
          categoryColor={categoryColor}
          shells={element.shells}
          symbol={element.s}
        />
      </div>
      {mascotEnabled && (
        <Alert className="element-detail-angie" tone="info" title="Analyse Angie">
          <span aria-hidden="true"><Bot size={16} /></span>
          {fact}
        </Alert>
      )}
    </section>
  );
}
