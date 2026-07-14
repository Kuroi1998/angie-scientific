import React, { useState, Suspense } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

const GasEquationsStation = React.lazy(() => import('./stations/gas-equations/GasEquationsStation').then(m => ({ default: m.GasEquationsStation })));
const KineticsStation = React.lazy(() => import('./stations/kinetics-equilibrium/KineticsStation').then(m => ({ default: m.KineticsStation })));
const PhaseDiagramStation = React.lazy(() => import('./stations/phase-diagrams/PhaseDiagramStation').then(m => ({ default: m.PhaseDiagramStation })));
const SpectroscopyStation = React.lazy(() => import('./stations/spectroscopy/SpectroscopyStation').then(m => ({ default: m.SpectroscopyStation })));

type StationType = 'gas' | 'kinetics' | 'phase' | 'spectroscopy';

export const PhysChemHub: React.FC = () => {
  const { t } = useLanguage('lab');
  const [activeStation, setActiveStation] = useState<StationType>('gas');

  const stations: { id: StationType, label: string, desc: string }[] = [
    { id: 'gas', label: t('hub.gas'), desc: t('hub.gasDesc') },
    { id: 'kinetics', label: t('hub.kinetics'), desc: t('hub.kineticsDesc') },
    { id: 'phase', label: t('hub.phase'), desc: t('hub.phaseDesc') },
    { id: 'spectroscopy', label: t('hub.spectro'), desc: t('hub.spectroDesc') }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      
      <nav style={{
        display: 'flex', gap: '12px', padding: '16px', background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px', border: '1px solid var(--as-border-inverse)', overflowX: 'auto'
      }}>
        {stations.map(station => {
          const isActive = activeStation === station.id;
          return (
            <button
              key={station.id}
              onClick={() => setActiveStation(station.id)}
              style={{
                flex: '1', minWidth: '150px',
                padding: '12px', textAlign: 'left',
                background: isActive ? 'var(--as-surface-inverse)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--as-accent-cyan)' : 'transparent'}`,
                borderRadius: '8px', cursor: 'pointer',
                transition: 'all 0.2s',
                color: isActive ? 'var(--as-text-inverse)' : 'var(--as-text-muted)'
              }}
            >
              <div style={{ fontFamily: 'var(--as-font-title)', fontSize: '14px', marginBottom: '4px', color: isActive ? 'color-mix(in srgb, var(--as-accent-cyan) 65%, var(--as-text-inverse) 35%)' : 'inherit' }}>
                {station.label}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>
                {station.desc}
              </div>
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--as-text-muted)' }}>{t('hub.loading')}</div>}>
          {activeStation === 'gas' && <GasEquationsStation />}
          {activeStation === 'kinetics' && <KineticsStation />}
          {activeStation === 'phase' && <PhaseDiagramStation />}
          {activeStation === 'spectroscopy' && <SpectroscopyStation />}
        </Suspense>
      </div>

    </div>
  );
};
