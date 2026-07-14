import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Play, ShieldCheck } from 'lucide-react';
import { Alert, Badge, Button } from '../../design-system';
import { useLanguage } from '../../hooks/useLanguage';
import { predictReaction } from '../../engines/chemistryEngine';
import type { ReactionResult } from '../../engines/chemistryEngine';
import { AudioManager } from '../../services/Audio/AudioManager';
import { ParticleEngine } from '../../services/Visuals/ParticleEngine';
import { useMascot } from '../Mascot/useMascot';
import { useUserProgress } from '../useUserProgress';
import { LabStation, SafetyList, StationPanel } from '../LabStation';
import { EnergyDiagram } from './EnergyDiagram';
import { FusionChamber } from './FusionChamber';
import { FusionSelector } from './FusionSelector';
import { ReactionTelemetry } from './ReactionTelemetry';
import { Stoichiometry } from './Stoichiometry';
import { getProductMessage } from './fusionData';
import './fusion-lab.css';

interface FusionCoreProps {
  selectedReactant1: string | null;
  selectedReactant2: string | null;
  setSelectedReactant1: (s: string | null) => void;
  setSelectedReactant2: (s: string | null) => void;
}

export const FusionCore: React.FC<FusionCoreProps> = ({
  selectedReactant1,
  selectedReactant2,
  setSelectedReactant1,
  setSelectedReactant2,
}) => {
  const { language, t } = useLanguage();
  const { profile, addSuccessfulReaction } = useUserProgress();
  const { showMessage, setEmotion } = useMascot();
  const [customInput, setCustomInput] = useState('');
  const [reactionResult, setReactionResult] = useState<ReactionResult | null>(null);
  const reactionEffectsRef = useRef({
    addSuccessfulReaction,
    language,
    reducedMotion: profile?.reducedMotion,
    setEmotion,
    showMessage,
  });

  useEffect(() => {
    reactionEffectsRef.current = {
      addSuccessfulReaction,
      language,
      reducedMotion: profile?.reducedMotion,
      setEmotion,
      showMessage,
    };
  });

  useEffect(() => {
    if (!selectedReactant1 || !selectedReactant2 || selectedReactant1 === selectedReactant2) {
      setReactionResult(null);
      return;
    }

    const result = predictReaction(selectedReactant1, selectedReactant2);
    setReactionResult(result);
    if (!result) return;

    const product = result.products[0]?.symbol;
    const effects = reactionEffectsRef.current;
    if (result.stable) {
      AudioManager.getInstance().playSuccess();
      void effects.addSuccessfulReaction(product);
      effects.showMessage(getProductMessage(product, effects.language), 3000, 'happy');
      effects.setEmotion('happy');
      if (effects.reducedMotion !== true) ParticleEngine.getInstance().fireFusionSuccess();
      return;
    }

    AudioManager.getInstance().playError();
    effects.showMessage(t('core.unstableError', { ns: 'fusion' }));
    effects.setEmotion('surprised');
    if (effects.reducedMotion !== true) ParticleEngine.getInstance().fireReactionExplosion();
  }, [selectedReactant1, selectedReactant2, t]);

  const selectQuickElement = (symbol: string) => {
    if (!selectedReactant1) {
      setSelectedReactant1(symbol);
      return;
    }
    if (!selectedReactant2 && selectedReactant1 !== symbol) {
      setSelectedReactant2(symbol);
      return;
    }
    setSelectedReactant2(symbol);
  };

  const clearReactants = () => {
    setSelectedReactant1(null);
    setSelectedReactant2(null);
    setReactionResult(null);
  };

  const metrics = useMemo(() => [
    {
      label: t('core.metrics.reactants', { ns: 'fusion' }),
      value: `${(selectedReactant1 ? 1 : 0) + (selectedReactant2 ? 1 : 0)}/2`,
      tone: 'info' as const,
    },
    {
      label: t('core.metrics.state', { ns: 'fusion' }),
      value: reactionResult ? (reactionResult.stable ? t('core.metrics.stateStable', { ns: 'fusion' }) : t('core.metrics.stateUnstable', { ns: 'fusion' })) : t('core.metrics.stateReady', { ns: 'fusion' }),
      tone: reactionResult?.stable ? ('success' as const) : ('warning' as const),
    },
    {
      label: t('core.metrics.product', { ns: 'fusion' }),
      value: reactionResult?.products[0]?.symbol ?? '--',
      tone: 'neutral' as const,
    },
  ], [reactionResult, selectedReactant1, selectedReactant2, t]);

  return (
    <LabStation
      actions={<Badge tone="info">{t('core.localSim', { ns: 'fusion' })}</Badge>}
      eyebrow={t('core.stationEyebrow', { ns: 'fusion' })}
      metrics={metrics}
      subtitle={t('core.stationSubtitle', { ns: 'fusion' })}
      title={t('core.stationTitle', { ns: 'fusion' })}
    >
      <div className="lab-layout-grid">
        <div className="lab-station-column">
          <StationPanel eyebrow={t('core.selectionEyebrow', { ns: 'fusion' })} title={t('core.selectionTitle', { ns: 'fusion' })}>
            <FusionSelector
              customInput={customInput}
              onCustomInputChange={setCustomInput}
              onSelect={selectQuickElement}
              selected={[selectedReactant1, selectedReactant2]}
            />
          </StationPanel>
          <StationPanel eyebrow={t('core.safetyEyebrow', { ns: 'fusion' })} title={t('core.safetyTitle', { ns: 'fusion' })}>
            <SafetyList
              items={t('core.safetyList', { ns: 'fusion', returnObjects: true }) as string[]}
            />
          </StationPanel>
        </div>
        <div className="lab-station-column">
          <StationPanel
            actions={(selectedReactant1 || selectedReactant2) && (
              <Button onClick={clearReactants} size="sm" variant="outline">
                {t('core.clearBtn', { ns: 'fusion' })}
              </Button>
            )}
            eyebrow={t('core.prepEyebrow', { ns: 'fusion' })}
            title={t('core.prepTitle', { ns: 'fusion' })}
          >
            <FusionChamber
              onClear={clearReactants}
              onRemoveReactant1={() => setSelectedReactant1(null)}
              onRemoveReactant2={() => setSelectedReactant2(null)}
              reactant1={selectedReactant1}
              reactant2={selectedReactant2}
            />
          </StationPanel>
          <StationPanel eyebrow={t('core.resultEyebrow', { ns: 'fusion' })} title={t('core.resultTitle', { ns: 'fusion' })}>
            <ReactionTelemetry
              key={reactionResult?.products[0]?.symbol ?? 'empty'}
              learningLevel={profile?.learningLevel}
              reaction={reactionResult}
            />
          </StationPanel>
        </div>
      </div>

      {reactionResult && (
        <div className="lab-layout-grid is-balanced">
          <StationPanel
            actions={<Badge tone={reactionResult.stable ? 'success' : 'warning'}>{reactionResult.type}</Badge>}
            eyebrow={t('core.calcEyebrow', { ns: 'fusion' })}
            title={t('core.calcTitle', { ns: 'fusion' })}
          >
            <Stoichiometry
              reaction={reactionResult}
              onSelectCascadeReaction={(sym1, sym2) => {
                setSelectedReactant1(sym1);
                setSelectedReactant2(sym2);
              }}
            />
          </StationPanel>
          <StationPanel
            className="fusion-energy-panel"
            eyebrow={t('core.previewEyebrow', { ns: 'fusion' })}
            title={t('core.energyDiagram', { ns: 'fusion' })}
          >
            <EnergyDiagram dH={reactionResult.dH} />
            <Alert title={t('core.nextActionTitle', { ns: 'fusion' })} tone="info">
              <span className="fusion-alert-line">
                {reactionResult.stable ? <ShieldCheck size={16} /> : <Activity size={16} />}
                {reactionResult.stable
                  ? t('core.nextActionStable', { ns: 'fusion' })
                  : t('core.nextActionUnstable', { ns: 'fusion' })}
              </span>
            </Alert>
            <Button iconLeft={<Play size={16} />} variant="outline">
              {t('core.logAttemptBtn', { ns: 'fusion' })}
            </Button>
          </StationPanel>
        </div>
      )}
    </LabStation>
  );
};
