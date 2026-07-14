import { Filter, RotateCcw } from 'lucide-react';
import {
  Button,
  Input,
  Select,
} from '../../design-system';
import {
  categoryMeta,
  stateOptions,
} from './periodicTableModel';
import type { PeriodicFilters } from './periodicTableTypes';

import { useLanguage } from '../../hooks/useLanguage';

interface PeriodicTableToolbarProps {
  filters: PeriodicFilters;
  language: string | null;
  onFiltersChange: (filters: PeriodicFilters) => void;
  resultCount: number;
}

export function PeriodicTableToolbar({
  filters,
  language,
  onFiltersChange,
  resultCount,
}: PeriodicTableToolbarProps) {
  const { t } = useLanguage();
  const setFilter = (next: Partial<PeriodicFilters>) => {
    onFiltersChange({ ...filters, ...next });
  };

  return (
    <section className="pt-toolbar" aria-label="Recherche et filtres">
      <div className="pt-search-field">
        <Input
          label={t('toolbar.search', { ns: 'periodicTable' })}
          onChange={(event) => setFilter({ query: event.target.value })}
          placeholder={t('toolbar.searchPlaceholder', { ns: 'periodicTable' })}
          value={filters.query}
        />
      </div>
      <Select
        label={t('toolbar.category', { ns: 'periodicTable' })}
        onChange={(event) => setFilter({ category: event.target.value })}
        options={[
          { label: t('toolbar.allCategories', { ns: 'periodicTable' }), value: 'all' },
          ...categoryMeta.map((category) => ({
            label: language === 'es' ? category.labelEs : category.labelFr,
            value: category.id,
          })),
        ]}
        value={filters.category}
      />
      <Select
        label={t('toolbar.state', { ns: 'periodicTable' })}
        onChange={(event) => setFilter({ state: event.target.value })}
        options={[
          { label: t('toolbar.allStates', { ns: 'periodicTable' }), value: 'all' },
          ...stateOptions.filter((state) => state.id !== 'all').map((state) => ({
          label: language === 'es' ? state.labelEs : state.labelFr,
          value: state.id,
        }))]}
        value={filters.state}
      />
      <div className="pt-toolbar-actions">
        <span><Filter size={15} /> {t('toolbar.results', { ns: 'periodicTable', count: resultCount })}</span>
        <Button
          iconLeft={<RotateCcw size={16} />}
          onClick={() => onFiltersChange({ category: 'all', query: '', state: 'all' })}
          variant="outline"
        >
          {t('toolbar.reset', { ns: 'periodicTable' })}
        </Button>
      </div>
    </section>
  );
}
