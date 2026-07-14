import React from 'react';
import './scientific-shared.css';

export interface FormulaDisplayProps {
  formula: string; // The formula text (can be pseudo-LaTeX for now)
  name?: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  name,
  description,
  variant = 'primary',
  className = ''
}) => {
  return (
    <div className={`sci-formula-container sci-formula-${variant} ${className}`}>
      {name && <div className="sci-formula-name">{name}</div>}
      <div className="sci-formula-expression">
        {formula}
      </div>
      {description && <div className="sci-formula-desc">{description}</div>}
    </div>
  );
};
