import React, { useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Badge, Button, Input, Switch } from '../../design-system';
import type { ReactionResult } from '../../engines/chemistryEngine';
import { LabReadout } from '../LabStation';
import { useLanguage } from '../../hooks/useLanguage';

interface StoichiometryProps {
  reaction: ReactionResult;
  onSelectCascadeReaction?: (sym1: string, sym2: string, initialMassOfReactant: number) => void;
}

function toNumber(value: string) {
  return Number.parseFloat(value) || 0;
}

export const Stoichiometry: React.FC<StoichiometryProps> = ({
  onSelectCascadeReaction,
  reaction,
}) => {
  const { t } = useLanguage();
  const [m1, setM1] = useState('10');
  const [m2, setM2] = useState('8');
  const [expYield, setExpYield] = useState('');
  const [locked, setLocked] = useState(true);

  const r1 = reaction.reactants[0];
  const r2 = reaction.reactants[1];
  const product = reaction.products[0];
  const n1 = toNumber(m1) / r1.molarMass || 0;
  const n2 = toNumber(m2) / r2.molarMass || 0;
  const f1 = n1 / r1.coef;
  const f2 = n2 / r2.coef;
  const limiting = f1 <= f2 ? r1 : r2;
  const excess = f1 <= f2 ? r2 : r1;
  const limitingFactor = Math.min(f1, f2);
  const excessLeft = Math.max(0, (f1 <= f2 ? n2 - f1 * r2.coef : n1 - f2 * r1.coef));
  const theoreticalMoles = limitingFactor * product.coef;
  const theoreticalMass = theoreticalMoles * product.molarMass;
  const expMass = toNumber(expYield);
  const percentYield = theoreticalMass > 0 ? Math.min(100, (expMass / theoreticalMass) * 100) : 0;
  const massLoss = Math.max(0, toNumber(m1) + toNumber(m2) - expMass);

  const updateLockedMass = (value: string, source: 'r1' | 'r2') => {
    if (source === 'r1') {
      setM1(value);
      const matchingMoles = (toNumber(value) / r1.molarMass / r1.coef) * r2.coef;
      setM2((matchingMoles * r2.molarMass).toFixed(2));
      return;
    }
    setM2(value);
    const matchingMoles = (toNumber(value) / r2.molarMass / r2.coef) * r1.coef;
    setM1((matchingMoles * r1.molarMass).toFixed(2));
  };

  const handleMassChange = (value: string, source: 'r1' | 'r2') => {
    if (locked) updateLockedMass(value, source);
    else if (source === 'r1') setM1(value);
    else setM2(value);
  };

  return (
    <div className="stoich-panel">
      <div className="stoich-header">
        <Switch
          checked={locked}
          label={t('stoichiometry.ratioLabel', { ns: 'fusion' })}
          onChange={(event) => setLocked(event.target.checked)}
        />
        <Badge tone={locked ? 'info' : 'warning'}>
          {locked ? t('stoichiometry.ratioLocked', { ns: 'fusion' }) : t('stoichiometry.ratioIndependent', { ns: 'fusion' })}
        </Badge>
      </div>

      <div className="lab-control-grid">
        <Input
          label={t('stoichiometry.massInput', { ns: 'fusion', symbol: r1.symbol })}
          onChange={(event) => handleMassChange(event.target.value, 'r1')}
          type="number"
          value={m1}
        />
        <Input
          label={t('stoichiometry.massInput', { ns: 'fusion', symbol: r2.symbol })}
          onChange={(event) => handleMassChange(event.target.value, 'r2')}
          type="number"
          value={m2}
        />
        <Input
          label={t('stoichiometry.expMassInput', { ns: 'fusion' })}
          onChange={(event) => setExpYield(event.target.value)}
          placeholder="0.0"
          type="number"
          value={expYield}
        />
      </div>

      <div className="lab-readout-grid">
        <LabReadout label={t('stoichiometry.molesOutput', { ns: 'fusion', symbol: r1.symbol })} value={n1.toFixed(3)} />
        <LabReadout label={t('stoichiometry.molesOutput', { ns: 'fusion', symbol: r2.symbol })} value={n2.toFixed(3)} />
        <LabReadout label={t('stoichiometry.limitingReactant', { ns: 'fusion' })} tone="warning" value={limiting.symbol} />
        <LabReadout label={t('stoichiometry.theoreticalYield', { ns: 'fusion' })} tone="success" value={`${theoreticalMass.toFixed(2)} g`} />
        <LabReadout label={t('stoichiometry.actualYield', { ns: 'fusion' })} tone="info" value={`${percentYield.toFixed(1)} %`} />
        <LabReadout
          label={t('stoichiometry.excessLeft', { ns: 'fusion' })}
          value={`${(excessLeft * excess.molarMass).toFixed(2)} g ${excess.symbol}`}
        />
        <LabReadout label={t('stoichiometry.massLoss', { ns: 'fusion' })} tone={massLoss > 0.01 ? 'warning' : 'neutral'} value={`${massLoss.toFixed(2)} g`} />
      </div>

      {product.symbol === 'H2O' && onSelectCascadeReaction && (
        <div className="stoich-cascade">
          <div>
            <strong>{t('stoichiometry.cascadeTitle', { ns: 'fusion' })}</strong>
            <p>{t('stoichiometry.cascadeDesc', { ns: 'fusion' })}</p>
          </div>
          <Button
            iconRight={<ArrowRight size={16} />}
            onClick={() => onSelectCascadeReaction('Na', 'H2O', theoreticalMass)}
            variant="outline"
          >
            {t('stoichiometry.initiateBtn', { ns: 'fusion' })}
          </Button>
        </div>
      )}

      <Button
        iconLeft={<RefreshCw size={16} />}
        onClick={() => {
          setM1('10');
          setM2('8');
          setExpYield('');
        }}
        variant="ghost"
      >
        {t('stoichiometry.resetCalcBtn', { ns: 'fusion' })}
      </Button>
    </div>
  );
};
