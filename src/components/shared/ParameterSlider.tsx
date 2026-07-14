import React, { useId } from 'react';
import './scientific-shared.css';

export interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  disabled = false,
  tooltip,
  className = ''
}) => {
  const id = useId();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(Math.min(Math.max(val, min), max));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className={`sci-slider-container ${disabled ? 'disabled' : ''} ${className}`} title={tooltip}>
      <div className="sci-slider-header">
        <label htmlFor={id} className="sci-slider-label">{label}</label>
        <div className="sci-slider-input-group">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className="sci-slider-number-input"
          />
          {unit && <span className="sci-slider-unit">{unit}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        disabled={disabled}
        className="sci-slider-range"
      />
      <div className="sci-slider-limits">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
