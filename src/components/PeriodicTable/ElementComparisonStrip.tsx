import { X } from 'lucide-react';
import { Badge, Button } from '../../design-system';
import { useLanguage } from '../../hooks/useLanguage';
import {
  getCategoryLabel,
  getElementName,
} from './periodicTableModel';
import type { ElementType } from './periodicTableTypes';

interface ElementComparisonStripProps {
  elements: ElementType[];
  onClear: () => void;
}

export function ElementComparisonStrip({
  elements,
  onClear,
}: ElementComparisonStripProps) {
  const { language, t } = useLanguage();
  if (elements.length === 0) return null;

  return (
    <section className="pt-comparison" aria-label={t('comparison.title', { ns: 'periodicTable' })}>
      <div>
        <p className="as-eyebrow">{t('comparison.title', { ns: 'periodicTable' })}</p>
        <h3>{elements.map((element) => element.s).join(' / ')}</h3>
      </div>
      <div className="pt-comparison-list">
        {elements.map((element) => (
          <article key={element.s}>
            <strong>{getElementName(element, language)}</strong>
            <Badge tone="info">{getCategoryLabel(element.cat, language)}</Badge>
            <span>{element.mass.toFixed(2)} u</span>
          </article>
        ))}
      </div>
      <Button iconLeft={<X size={15} />} onClick={onClear} size="sm" variant="ghost">
        {t('comparison.clear', { ns: 'periodicTable' })}
      </Button>
    </section>
  );
}
