import { Flame, Info, ShieldAlert } from 'lucide-react';
import { Alert, Badge } from '../../design-system';
import type { ReactionResult } from '../../engines/chemistryEngine';
import { LabReadout } from '../LabStation';
import { ChemicalEquation } from './ChemicalEquation';
import { useLanguage } from '../../hooks/useLanguage';

interface ReactionTelemetryProps {
  learningLevel?: string;
  reaction: ReactionResult | null;
}

export function ReactionTelemetry({ learningLevel, reaction }: ReactionTelemetryProps) {
  const { t } = useLanguage();
  if (!reaction) {
    return (
      <Alert title={t('telemetry.noReactionTitle', { ns: 'fusion' })} tone="warning">
        <div className="fusion-empty">
          <ShieldAlert size={22} aria-hidden="true" />
          {t('telemetry.noReactionDesc', { ns: 'fusion' })}
        </div>
      </Alert>
    );
  }

  const product = reaction.products[0];
  const tone = reaction.stable ? 'success' : 'warning';

  return (
    <div
      aria-live="polite"
      className="fusion-result"
      data-stable={reaction.stable}
      role="status"
    >
      <div className="fusion-equation">
        <ChemicalEquation
          reactants={reaction.reactants.map((item) => ({
            coefficient: item.coef,
            formula: item.symbol,
          }))}
          products={reaction.products.map((item) => ({
            coefficient: item.coef,
            formula: item.symbol,
          }))}
        />
      </div>
      <div className="fusion-product-line">
        <strong>{product.name}</strong>
        <Badge tone={tone}>{reaction.stable ? t('telemetry.stable', { ns: 'fusion' }) : t('telemetry.unstable', { ns: 'fusion' })}</Badge>
      </div>
      <div className="lab-readout-grid">
        <LabReadout label={t('telemetry.enthalpy', { ns: 'fusion' })} tone="info" value={`${reaction.dH} kJ`} />
        <LabReadout label={t('telemetry.entropy', { ns: 'fusion' })} value={`${reaction.dS} J/K`} />
        <LabReadout label={t('telemetry.gibbs', { ns: 'fusion' })} tone={tone} value={`${reaction.dG} kJ`} />
      </div>
      <Alert tone={tone} title={reaction.stable ? t('telemetry.spontaneous', { ns: 'fusion' }) : t('telemetry.monitor', { ns: 'fusion' })}>
        <span className="fusion-alert-line">
          <Flame size={16} aria-hidden="true" />
          {reaction.stable
            ? t('telemetry.stableProduct', { ns: 'fusion' })
            : t('telemetry.unstableProduct', { ns: 'fusion' })}
        </span>
      </Alert>
      {learningLevel === 'discovery' && (
        <Alert title={t('telemetry.angieNoteTitle', { ns: 'fusion' })} tone="info">
          <span className="fusion-alert-line">
            <Info size={16} aria-hidden="true" />
            {t('telemetry.learningNote', { ns: 'fusion' })}
          </span>
        </Alert>
      )}
    </div>
  );
}
