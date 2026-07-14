import React from 'react';
import './scientific-shared.css';

export interface ScientificPanelProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glass';
  actions?: React.ReactNode;
}

export const ScientificPanel: React.FC<ScientificPanelProps> = ({
  title,
  icon,
  children,
  className = '',
  variant = 'glass',
  actions
}) => {
  return (
    <div className={`sci-panel sci-panel-${variant} ${className}`}>
      {(title || icon || actions) && (
        <div className="sci-panel-header">
          <div className="sci-panel-title-group">
            {icon && <span className="sci-panel-icon">{icon}</span>}
            {title && <h3 className="sci-panel-title">{title}</h3>}
          </div>
          {actions && <div className="sci-panel-actions">{actions}</div>}
        </div>
      )}
      <div className="sci-panel-content">
        {children}
      </div>
    </div>
  );
};
