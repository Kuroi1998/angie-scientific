import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Atom } from 'lucide-react';
import { Button, Modal } from '../../design-system';
import { useAngie } from '../../features/angie/state/useAngie';
import { useLanguage } from '../../hooks/useLanguage';
import { ElementFactRepository } from '../../services/Educational/ElementFactRepository';
import type { ElementType } from '../PeriodicTable/periodicTableTypes';
import { getCategoryColor } from '../PeriodicTable/periodicTableModel';
import { useUserProgress } from '../useUserProgress';
import { ElementDetailTabs } from './ElementDetailTabs';
import { ElementDetailTitle } from './ElementDetailTitle';
import { ElementDetailVisualPanel } from './ElementDetailVisualPanel';
import type { ElementDetailTab } from './elementDetailModel';
import {
  getElementDetailTexts,
  getFactEmotion,
} from './elementDetailModel';
import './element-detail-modal.css';

interface DetailModalProps {
  element: ElementType;
  onAddToFusion?: (element: ElementType) => void;
  onClose: () => void;
}

export function DetailModal({ element, onAddToFusion, onClose }: DetailModalProps) {
  const { language, t } = useLanguage();
  const { profile } = useUserProgress();
  const { showMessage } = useAngie();
  const [activeTab, setActiveTab] = useState<ElementDetailTab>('general');
  const categoryColor = getCategoryColor(element.cat);
  const texts = getElementDetailTexts(element, language);
  const fact = ElementFactRepository.getFactForElement(element.n, language || 'fr');

  useEffect(() => {
    if (profile?.mascotEnabled === false) return undefined;
    const timeout = window.setTimeout(() => {
      showMessage(fact.childFriendlyText, 6000, getFactEmotion(fact.category), 'contextualHelp');
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [element.n, fact.category, fact.childFriendlyText, profile?.mascotEnabled, showMessage]);

  const actions = onAddToFusion ? (
    <Button
      iconLeft={<Atom size={16} />}
      onClick={() => {
        onAddToFusion(element);
        onClose();
      }}
    >
      Utiliser au labo
    </Button>
  ) : null;

  return (
    <Modal
      actions={actions}
      bodyClassName="element-detail-body"
      className="element-detail-modal"
      closeLabel="Fermer la fiche element"
      isOpen
      onClose={onClose}
      title={(
        <ElementDetailTitle
          category={texts.category}
          categoryColor={categoryColor}
          element={element}
          name={texts.name}
        />
      )}
    >
      <div
        className="element-detail-shell"
        style={{ '--element-accent': categoryColor } as CSSProperties}
      >
        <ElementDetailVisualPanel
          categoryColor={categoryColor}
          element={element}
          fact={fact.childFriendlyText}
          mascotEnabled={profile?.mascotEnabled !== false}
        />
        <section className="element-detail-data" aria-label="Donnees de l'element">
          <ElementDetailTabs
            activeTab={activeTab}
            element={element}
            language={language}
            learningLevel={profile?.learningLevel}
            onChange={setActiveTab}
            t={t}
            texts={texts}
          />
        </section>
      </div>
    </Modal>
  );
}
