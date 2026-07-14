import type { CSSProperties } from 'react';
import { categoryMeta } from './periodicTableModel';
import { useLanguage } from '../../hooks/useLanguage';

export function PeriodicTableLegend({ language }: { language: string | null }) {
  const { t } = useLanguage();

  return (
    <section className="pt-legend" aria-label={t('legend.ariaLabel', { ns: 'periodicTable' })}>
      {categoryMeta.map((category) => (
        <span
          className="pt-legend-item"
          key={category.id}
          style={{ '--pt-category': category.color } as CSSProperties}
        >
          <span aria-hidden="true" />
          {language === 'es' ? category.labelEs : category.labelFr}
        </span>
      ))}
    </section>
  );
}
