import React from 'react';
import './scientific-shared.css';

export interface ScientificCardProps {
  title?: string;
  icon?: React.ReactNode;
  value?: React.ReactNode;
  unit?: string;
  description?: string;
  state?: 'normal' | 'active' | 'success' | 'warning' | 'error' | 'info' | 'loading' | 'disabled';
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ScientificCard: React.FC<ScientificCardProps> = ({
  title,
  icon,
  value,
  unit,
  description,
  state = 'normal',
  action,
  children,
  className = ''
}) => {
  return (
    <div className={`sci-card sci-card-${state} ${className}`}>
      {(title || icon || action) && (
        <div className="sci-card-header">
          <div className="sci-card-title-group">
            {icon && <span className="sci-card-icon">{icon}</span>}
            {title && <h4 className="sci-card-title">{title}</h4>}
          </div>
          {action && <div className="sci-card-action">{action}</div>}
        </div>
      )}
      
      {description && <p className="sci-card-desc">{description}</p>}
      
      {value !== undefined && (
        <div className="sci-card-value-container">
          <span className="sci-card-value">{value}</span>
          {unit && <span className="sci-card-unit">{unit}</span>}
        </div>
      )}
      
      {children && <div className="sci-card-content">{children}</div>}
    </div>
  );
};
