import React from 'react';
import type { SpectroscopyMode, PhotonProperties } from '../types/spectroscopy.types';

interface PhotonInfoPanelProps {
  mode: SpectroscopyMode;
  photonInfo: PhotonProperties | null;
}

export const PhotonInfoPanel: React.FC<PhotonInfoPanelProps> = ({ mode, photonInfo }) => {
  if (!photonInfo) {
    return (
      <div style={{ padding: '24px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px', textAlign: 'center', color: 'var(--as-text-muted)', fontSize: '12px' }}>
        Survolez le spectre pour activer le détecteur de photons.
      </div>
    );
  }

  const isEmission = mode === 'EMISSION';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
      {isEmission ? (
        <div style={{ padding: '12px', background: 'var(--surface-card)', border: `1px solid ${photonInfo.colorHex}`, borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>Couleur</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: photonInfo.colorHex, boxShadow: `0 0 8px ${photonInfo.colorHex}` }} />
            <div style={{ fontSize: '14px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)' }}>
              {photonInfo.wavelength.toFixed(1)} nm
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px', background: 'var(--surface-card)', border: `1px solid var(--as-border-inverse)`, borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>Nombre d'onde</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div style={{ fontSize: '14px', fontFamily: 'var(--as-font-mono)', color: 'color-mix(in srgb, var(--as-accent-amber) 75%, var(--as-text-primary) 25%)' }}>
              {(1e7 / photonInfo.wavelength).toFixed(0)} cm⁻¹
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '12px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>Fréquence (ν)</div>
        <div style={{ fontSize: '14px', fontFamily: 'var(--as-font-mono)', color: 'var(--text-primary)', margin: '4px 0' }}>
          {(photonInfo.frequency / 1e12).toFixed(2)} THz
        </div>
      </div>

      <div style={{ padding: '12px', background: 'var(--surface-card)', border: '1px solid var(--as-border-inverse)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--as-text-secondary)', fontFamily: 'var(--as-font-title)' }}>Énergie (E = hν)</div>
        <div style={{ fontSize: '14px', fontFamily: 'var(--as-font-mono)', color: 'color-mix(in srgb, var(--as-accent-cyan) 75%, var(--as-text-primary) 25%)', margin: '4px 0' }}>
          {photonInfo.energyEV.toFixed(2)} eV
        </div>
        <div style={{ fontSize: '10px', color: 'var(--as-text-muted)', fontFamily: 'var(--as-font-mono)' }}>
          {photonInfo.energyJoules.toExponential(3)} J
        </div>
      </div>
    </div>
  );
};
