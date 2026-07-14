import { Tabs } from '../../design-system';
import type { LearningLevel } from '../../data/educational/models';
import type { Language } from '../../hooks/useLanguage';
import type { ElementType } from '../PeriodicTable/periodicTableTypes';
import { ElementDetailContent } from './ElementDetailContent';
import type {
  ElementDetailTab,
  ElementDetailTexts,
} from './elementDetailModel';
import { getElementDetailTabs } from './elementDetailModel';

interface ElementDetailTabsProps {
  activeTab: ElementDetailTab;
  element: ElementType;
  language: Language | null;
  learningLevel?: LearningLevel;
  onChange: (tab: ElementDetailTab) => void;
  t: (key: string) => string;
  texts: ElementDetailTexts;
}

export function ElementDetailTabs({
  activeTab,
  element,
  language,
  learningLevel,
  onChange,
  t,
  texts,
}: ElementDetailTabsProps) {
  const tabs = getElementDetailTabs(element, language, t).map((tab) => ({
    ...tab,
    content: (
      <ElementDetailContent
        activeTab={tab.id}
        element={element}
        learningLevel={learningLevel}
        t={t}
        texts={texts}
      />
    ),
  }));

  return (
    <Tabs
      ariaLabel="Sections de la fiche element"
      items={tabs}
      onChange={(tab) => onChange(tab as ElementDetailTab)}
      value={activeTab}
    />
  );
}
