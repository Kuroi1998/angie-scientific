import { Star } from 'lucide-react';
import { Alert } from '../../design-system';
import type { LearningLevel } from '../../data/educational/models';
import type { ElementType } from '../PeriodicTable/periodicTableTypes';
import { LewisVisualizer } from './LewisVisualizer';
import type {
  ElementDetailTab,
  ElementDetailTexts,
} from './elementDetailModel';
import { formatElementValue } from './elementDetailModel';

interface ElementDetailContentProps {
  activeTab: ElementDetailTab;
  element: ElementType;
  learningLevel?: LearningLevel;
  t: (key: string) => string;
  texts: ElementDetailTexts;
}

export function ElementDetailContent({
  activeTab,
  element,
  learningLevel,
  t,
  texts,
}: ElementDetailContentProps) {
  if (activeTab === 'superpowers') {
    const copy = learningLevel === 'discovery'
      ? t('element.superpowerDesc')
      : texts.desc;
    return (
      <Alert className="element-detail-callout" tone="warning" title={t('element.superpower')}>
        <Star size={18} aria-hidden="true" />
        {copy}
      </Alert>
    );
  }

  if (activeTab === 'atomic') {
    return (
      <DataGrid
        items={[
          [t('element.config'), element.config],
          [t('element.shells'), element.shells.join(', ')],
          [t('element.atomicRadius'), formatElementValue(element.ar, 'pm')],
          [t('element.crystal'), element.crystal],
        ]}
      />
    );
  }

  if (activeTab === 'quantum') {
    return (
      <DataGrid
        items={[
          [t('element.electronegativity'), formatElementValue(element.en)],
          [t('element.ionization'), formatElementValue(element.ie, 'kJ/mol')],
          [t('element.affinity'), formatElementValue(element.ea, 'kJ/mol')],
        ]}
      />
    );
  }

  if (activeTab === 'bonds') {
    return <LewisVisualizer centralSymbol={element.s} />;
  }

  if (activeTab === 'history') {
    return (
      <div className="element-detail-story">
        <StoryBlock title={t('element.discovery')} value={texts.history} />
        <StoryBlock title={t('element.uses')} value={texts.uses} />
      </div>
    );
  }

  return (
    <div className="element-detail-general">
      <DataGrid
        items={[
          [t('element.state'), texts.state],
          [t('element.density'), formatElementValue(element.density, 'g/cm3')],
          [t('element.meltingPoint'), formatElementValue(element.mp, 'K')],
          [t('element.boilingPoint'), formatElementValue(element.bp, 'K')],
        ]}
      />
      <p className="element-detail-description">{texts.desc}</p>
    </div>
  );
}

function DataGrid({
  items,
}: {
  items: [string, string][];
}) {
  // Values used to be tinted with the element's category color, but that
  // color isn't guaranteed to be legible against the card background in
  // every theme — the category is already conveyed via the modal's accent
  // border/background, so these fall back to the panel's normal text color.
  return (
    <dl className="element-detail-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StoryBlock({ title, value }: { title: string; value: string }) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}
