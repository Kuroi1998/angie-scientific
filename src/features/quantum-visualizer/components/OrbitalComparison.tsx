import React, { useState } from 'react';
import { OrbitalCanvas3D } from './OrbitalCanvas3D';
import { ScientificPanel } from '../../../components/shared/ScientificPanel';
import { orbitalList } from '../services/wavefunctionCalculations';
import { useLanguage } from '../../../hooks/useLanguage';

export const OrbitalComparison: React.FC = () => {
  const { t } = useLanguage();
  const [viewMode] = useState<'heatmap' | 'density' | 'phase'>('heatmap');
  const [orb1, setOrb1] = useState(orbitalList[1]); // 2s
  const [orb2, setOrb2] = useState(orbitalList[3]); // 2pz

  const getSelect = (label: string, orb: typeof orb1, setOrb: (o: typeof orb1) => void) => (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ fontSize: '10px', color: 'var(--as-text-subtle)', display: 'block', marginBottom: '4px' }}>{label}</label>
      <select 
        value={orb.label} 
        onChange={(e) => {
          const found = orbitalList.find(o => o.label === e.target.value);
          if (found) setOrb(found);
        }}
        style={{ 
          width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', 
          border: '1px solid var(--as-border-inverse)', color: 'var(--text-primary)', borderRadius: '4px' 
        }}
      >
        {orbitalList.map(o => <option key={o.label} value={o.label}>{o.label.toUpperCase()}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Orbitale 1 */}
        <ScientificPanel title={t('compare.orbitalA', { ns: 'quantum', label: orb1.label })} variant="glass">
          {getSelect(t('compare.chooseA', { ns: 'quantum' }), orb1, setOrb1)}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '250px' }}>
              <OrbitalCanvas3D n={orb1.n} l={orb1.l} m={orb1.m} viewMode={viewMode} />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--as-text-subtle)' }}>
            {t('compare.totalNodes', { ns: 'quantum', nodes: orb1.n - 1 })} <br/>
            {t('compare.relativeEnergy', { ns: 'quantum', energy: -(1/Math.pow(orb1.n, 2)).toFixed(3) })}
          </div>
        </ScientificPanel>

        {/* Orbitale 2 */}
        <ScientificPanel title={t('compare.orbitalB', { ns: 'quantum', label: orb2.label })} variant="glass">
          {getSelect(t('compare.chooseB', { ns: 'quantum' }), orb2, setOrb2)}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '250px' }}>
              <OrbitalCanvas3D n={orb2.n} l={orb2.l} m={orb2.m} viewMode={viewMode} />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--as-text-subtle)' }}>
            {t('compare.totalNodes', { ns: 'quantum', nodes: orb2.n - 1 })} <br/>
            {t('compare.relativeEnergy', { ns: 'quantum', energy: -(1/Math.pow(orb2.n, 2)).toFixed(3) })}
          </div>
        </ScientificPanel>

      </div>
    </div>
  );
};
