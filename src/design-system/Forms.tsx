import { useId } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import type { AsSize, AsStatus } from './types';
import { cx, sizeClass } from './types';

interface FieldMeta {
  hint?: ReactNode;
  label: ReactNode;
  status?: AsStatus;
}

function Field({
  children,
  hint,
  id,
  label,
  status = 'normal',
}: FieldMeta & { children: ReactNode; id: string }) {
  return (
    <label className="as-field" data-status={status} htmlFor={id}>
      <span className="as-field-label">{label}</span>
      {children}
      {hint && <span className="as-field-hint">{hint}</span>}
    </label>
  );
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    FieldMeta {
  controlSize?: AsSize;
}

export function Input({
  className,
  controlSize = 'md',
  hint,
  id,
  label,
  status,
  ...props
}: InputProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <Field hint={hint} id={controlId} label={label} status={status}>
      <input
        {...props}
        className={cx('as-input', sizeClass(controlSize), className)}
        id={controlId}
      />
    </Field>
  );
}

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldMeta {
  controlSize?: AsSize;
}

export function Textarea({
  className,
  controlSize = 'md',
  hint,
  id,
  label,
  status,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <Field hint={hint} id={controlId} label={label} status={status}>
      <textarea
        {...props}
        className={cx('as-input as-textarea', sizeClass(controlSize), className)}
        id={controlId}
      />
    </Field>
  );
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    FieldMeta {
  controlSize?: AsSize;
  options: SelectOption[];
}

export function Select({
  className,
  controlSize = 'md',
  hint,
  id,
  label,
  options,
  status,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <Field hint={hint} id={controlId} label={label} status={status}>
      <select
        {...props}
        className={cx('as-input as-select', sizeClass(controlSize), className)}
        id={controlId}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

interface ChoiceProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label: ReactNode;
}

export function Checkbox({ className, label, ...props }: ChoiceProps) {
  return (
    <label className={cx('as-choice', className)}>
      <input {...props} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

export function Radio({ className, label, ...props }: ChoiceProps) {
  return (
    <label className={cx('as-choice', className)}>
      <input {...props} type="radio" />
      <span>{label}</span>
    </label>
  );
}

export function Switch({ className, label, ...props }: ChoiceProps) {
  return (
    <label className={cx('as-switch', className)}>
      <input {...props} role="switch" type="checkbox" />
      <span className="as-switch-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    FieldMeta {
  valueLabel?: ReactNode;
}

export function Slider({ hint, id, label, status, valueLabel, ...props }: SliderProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <Field hint={hint} id={controlId} label={label} status={status}>
      <div className="as-slider-row">
        <input {...props} className="as-slider" id={controlId} type="range" />
        {valueLabel && <span className="as-slider-value">{valueLabel}</span>}
      </div>
    </Field>
  );
}
