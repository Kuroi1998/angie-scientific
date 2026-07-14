import { Keyboard, Wifi, ZoomIn } from 'lucide-react';
import { Badge } from '../../design-system';

import { useLanguage } from '../../hooks/useLanguage';

interface PeriodicTableStatusProps {
  activeFilterCount: number;
  selectedSymbol?: string;
  visibleCount: number;
  zoomLevel: number;
}

export function PeriodicTableStatus({
  activeFilterCount,
  selectedSymbol,
  visibleCount,
  zoomLevel,
}: PeriodicTableStatusProps) {
  const { t } = useLanguage();

  return (
    <footer className="pt-status">
      <span>{t('status.visibleElements', { ns: 'periodicTable', count: visibleCount })}</span>
      <Badge tone={activeFilterCount ? 'warning' : 'neutral'}>
        {t('status.filters', { ns: 'periodicTable', count: activeFilterCount })}
      </Badge>
      <span><ZoomIn size={14} /> {Math.round(zoomLevel * 100)}%</span>
      {selectedSymbol && <Badge tone="info">{t('status.selection', { ns: 'periodicTable', symbol: selectedSymbol })}</Badge>}
      <span><Keyboard size={14} /> {t('status.inputMethods', { ns: 'periodicTable' })}</span>
      <span className="pt-status-online"><Wifi size={14} /> {t('status.onlineStatus', { ns: 'periodicTable' })}</span>
    </footer>
  );
}
