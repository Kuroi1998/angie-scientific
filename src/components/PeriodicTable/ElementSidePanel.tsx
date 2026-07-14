import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Atom,
  Beaker,
  GitCompare,
  Info,
  Star,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  IconButton,
  ProgressBar,
} from '../../design-system';
import { useLanguage } from '../../hooks/useLanguage';
import { DetailModal } from '../ElementCard/DetailModal';
import {
  getCategoryColor,
  getCategoryLabel,
  getElementName,
  getStateLabel,
  percent,
} from './periodicTableModel';
import type { ElementType } from './periodicTableTypes';

interface ElementSidePanelProps {
  element: ElementType;
  isFavorite: boolean;
  onAddToFusion?: (element: ElementType) => void;
  onClose: () => void;
  onCompare: (element: ElementType) => void;
  onToggleFavorite: (symbol: string) => void;
}

export function ElementSidePanel({
  element,
  isFavorite,
  onAddToFusion,
  onClose,
  onCompare,
  onToggleFavorite,
}: ElementSidePanelProps) {
  const { language, t } = useLanguage();
  const [showFullDetail, setShowFullDetail] = useState(false);
  const name = getElementName(element, language);
  const categoryColor = getCategoryColor(element.cat);

  return (
    <>
      <aside
        className="pt-side-panel"
        style={{ '--pt-category': categoryColor } as CSSProperties}
      >
        <header className="pt-side-header">
          <div className="pt-side-symbol" aria-hidden="true">
            <span>{element.n}</span>
            <strong>{element.s}</strong>
          </div>
          <div>
            <h3>{name}</h3>
            <Badge tone="info">{getCategoryLabel(element.cat, language)}</Badge>
          </div>
          <IconButton icon={<X size={17} />} label={t('sidePanel.close', { ns: 'periodicTable' })} onClick={onClose} />
        </header>

        <p className="pt-side-description">
          {language === 'es' ? element.descES : element.descFR}
        </p>

        <dl className="pt-property-grid">
          <Property label={t('sidePanel.state', { ns: 'periodicTable' })} value={getStateLabel(element.state, language)} />
          <Property label={t('sidePanel.mass', { ns: 'periodicTable' })} value={`${element.mass.toFixed(3)} u`} />
          <Property label={t('sidePanel.config', { ns: 'periodicTable' })} value={element.config} />
          <Property label={t('sidePanel.density', { ns: 'periodicTable' })} value={element.density ?? 'N/A'} />
        </dl>

        <div className="pt-meter-stack">
          <ProgressBar label={t('sidePanel.atomicMass', { ns: 'periodicTable' })} max={100} value={percent(element.mass, 294)} />
          <ProgressBar
            label={t('sidePanel.meltingPoint', { ns: 'periodicTable' })}
            max={100}
            tone="warning"
            value={percent(element.mp, 4000)}
          />
          <ProgressBar
            label={t('sidePanel.boilingPoint', { ns: 'periodicTable' })}
            max={100}
            tone="error"
            value={percent(element.bp, 6000)}
          />
        </div>

        <div className="pt-angie-note">
          <Info size={18} />
          <p>{t('sidePanel.angieNote', { ns: 'periodicTable' })}</p>
        </div>

        <div className="pt-side-actions">
          <Button iconLeft={<Atom size={16} />} onClick={() => setShowFullDetail(true)}>
            {t('sidePanel.fullDetail', { ns: 'periodicTable' })}
          </Button>
          <Button
            iconLeft={<Star size={16} />}
            onClick={() => onToggleFavorite(element.s)}
            selected={isFavorite}
            variant="outline"
          >
            {isFavorite ? t('sidePanel.removeFavorite', { ns: 'periodicTable' }) : t('sidePanel.addFavorite', { ns: 'periodicTable' })}
          </Button>
          <Button
            iconLeft={<Beaker size={16} />}
            onClick={() => onAddToFusion?.(element)}
            variant="outline"
          >
            {t('sidePanel.useInLab', { ns: 'periodicTable' })}
          </Button>
          <Button
            iconLeft={<GitCompare size={16} />}
            onClick={() => onCompare(element)}
            variant="ghost"
          >
            {t('sidePanel.compare', { ns: 'periodicTable' })}
          </Button>
        </div>
      </aside>

      {showFullDetail && (
        <DetailModal
          element={element}
          onAddToFusion={onAddToFusion}
          onClose={() => setShowFullDetail(false)}
        />
      )}
    </>
  );
}

function Property({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
