import { Plus } from 'lucide-react';
import { Button, Input } from '../../design-system';
import { quickElements } from './fusionData';
import { useLanguage } from '../../hooks/useLanguage';

interface FusionSelectorProps {
  customInput: string;
  onCustomInputChange: (value: string) => void;
  onSelect: (symbol: string) => void;
  selected: Array<string | null>;
}

export function FusionSelector({
  customInput,
  onCustomInputChange,
  onSelect,
  selected,
}: FusionSelectorProps) {
  const { t } = useLanguage();
  const submitCustom = () => {
    const symbol = customInput.trim();
    if (!symbol) return;
    onSelect(symbol);
    onCustomInputChange('');
  };

  return (
    <>
      <div className="fusion-element-grid" aria-label={t('selector.ariaList', { ns: 'fusion' })}>
        {quickElements.map((element) => {
          const isSelected = selected.includes(element.symbol);
          return (
            <button
              aria-label={element.symbol}
              aria-pressed={isSelected}
              className="fusion-element-button"
              disabled={isSelected}
              key={element.symbol}
              onClick={() => onSelect(element.symbol)}
              title={element.name}
              type="button"
            >
              <strong>{element.symbol}</strong>
              <span>{element.name}</span>
            </button>
          );
        })}
      </div>
      <div className="fusion-manual-entry">
        <Input
          label={t('selector.manualEntry', { ns: 'fusion' })}
          maxLength={4}
          onChange={(event) => onCustomInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submitCustom();
          }}
          placeholder={t('selector.manualPlaceholder', { ns: 'fusion' })}
          value={customInput}
        />
        <Button iconLeft={<Plus size={16} />} onClick={submitCustom}>
          {t('selector.addBtn', { ns: 'fusion' })}
        </Button>
      </div>
    </>
  );
}

