import React from 'react';
import type { ElementType } from './TableGrid';

interface SidePanelPropertiesProps {
  element: ElementType;
  catColor: string;
}

export const SidePanelProperties: React.FC<SidePanelPropertiesProps> = ({ element, catColor }) => {
  // Helpers to calculate gauge percentages
  const maxMass = 294; // Oganesson
  const massPercent = Math.min(100, Math.max(0, (element.mass / maxMass) * 100));

  // Temperature ranges for visual gauges
  // Melting point usually between 14K (H) and 3800K (C)
  const mpPercent = element.mp ? Math.min(100, (element.mp / 4000) * 100) : 0;
  const bpPercent = element.bp ? Math.min(100, (element.bp / 6000) * 100) : 0;

  return (
    <div className="lab-hud-properties">
      {/* Mass Gauge */}
      <div className="lab-gauge-group">
        <div className="lab-gauge-header">
          <span>MASSE ATOMIQUE</span>
          <span>{element.mass.toFixed(2)} u</span>
        </div>
        <div className="lab-gauge-track">
          <div 
            className="lab-gauge-fill" 
            style={{ width: `${massPercent}%`, backgroundColor: catColor, boxShadow: `0 0 10px ${catColor}` }}
          />
        </div>
      </div>

      {/* State Badge */}
      <div className="lab-state-badge">
        <span className="state-label">ÉTAT NATUREL</span>
        <span className={`state-value state-${element.state}`}>
          {element.state.toUpperCase()}
        </span>
      </div>

      {/* Temperature Gauges */}
      <div className="lab-gauge-group">
        <div className="lab-gauge-header">
          <span>POINT DE FUSION</span>
          <span>{element.mp ? `${element.mp} K` : 'N/A'}</span>
        </div>
        <div className="lab-gauge-track thermal">
          <div 
            className="lab-gauge-fill thermal-fill" 
            style={{ width: `${mpPercent}%` }}
          />
        </div>
      </div>

      <div className="lab-gauge-group">
        <div className="lab-gauge-header">
          <span>POINT D'ÉBULLITION</span>
          <span>{element.bp ? `${element.bp} K` : 'N/A'}</span>
        </div>
        <div className="lab-gauge-track thermal">
          <div 
            className="lab-gauge-fill thermal-fill" 
            style={{ width: `${bpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
