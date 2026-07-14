import { FlaskConical, RefreshCw } from 'lucide-react';
import { Button } from '../../design-system';
import { useLanguage } from '../../hooks/useLanguage';

interface FusionChamberProps {
  onClear: () => void;
  onRemoveReactant1: () => void;
  onRemoveReactant2: () => void;
  reactant1: string | null;
  reactant2: string | null;
}

function ReactantSlot({
  label,
  onRemove,
  value,
  emptyLabel,
  removeLabel,
}: {
  label: string;
  onRemove: () => void;
  value: string | null;
  emptyLabel: string;
  removeLabel: string;
}) {
  return (
    <button
      aria-label={value ? `${label}: ${value}. ${removeLabel}` : `${label}: ${emptyLabel}`}
      className="fusion-slot"
      disabled={!value}
      onClick={onRemove}
      type="button"
    >
      <span>{value ?? '-'}</span>
      <small>{label}</small>
    </button>
  );
}

export function FusionChamber({
  onClear,
  onRemoveReactant1,
  onRemoveReactant2,
  reactant1,
  reactant2,
}: FusionChamberProps) {
  const { t } = useLanguage();
  return (
    <div className="fusion-chamber" id="reactor-chamber">
      <div className="fusion-chamber-core" aria-hidden="true">
        <FlaskConical size={30} />
      </div>
      <div className="fusion-slots">
        <ReactantSlot label={t('chamber.reactant1', { ns: 'fusion' })} onRemove={onRemoveReactant1} value={reactant1} emptyLabel={t('chamber.emptySlot', { ns: 'fusion' })} removeLabel={t('chamber.removeReactant', { ns: 'fusion' })} />
        <span className="fusion-plus" aria-hidden="true">+</span>
        <ReactantSlot label={t('chamber.reactant2', { ns: 'fusion' })} onRemove={onRemoveReactant2} value={reactant2} emptyLabel={t('chamber.emptySlot', { ns: 'fusion' })} removeLabel={t('chamber.removeReactant', { ns: 'fusion' })} />
      </div>
      {(reactant1 || reactant2) && (
        <Button iconLeft={<RefreshCw size={16} />} onClick={onClear} variant="outline">
          {t('chamber.reset', { ns: 'fusion' })}
        </Button>
      )}
    </div>
  );
}

