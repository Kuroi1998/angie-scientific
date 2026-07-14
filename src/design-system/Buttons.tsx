import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { AsSize, AsTone, AsVariant } from './types';
import { cx, sizeClass, toneClass, variantClass } from './types';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  isLoading?: boolean;
  selected?: boolean;
  size?: AsSize;
  tone?: AsTone;
  variant?: AsVariant;
}

export function Button({
  children,
  className,
  disabled,
  iconLeft,
  iconRight,
  isLoading = false,
  selected = false,
  size = 'md',
  tone = 'accent',
  type = 'button',
  variant = 'solid',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={isLoading || undefined}
      className={cx(
        'as-button',
        toneClass(tone),
        sizeClass(size),
        variantClass(variant),
        className,
      )}
      data-loading={isLoading || undefined}
      data-selected={selected || undefined}
      disabled={disabled || isLoading}
      type={type}
    >
      {isLoading && <span className="as-spinner" aria-hidden="true" />}
      {!isLoading && iconLeft && (
        <span className="as-button-icon" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className="as-button-label">{children}</span>
      {iconRight && (
        <span className="as-button-icon" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'iconLeft' | 'iconRight'> {
  icon: ReactNode;
  label: string;
}

export function IconButton({
  className,
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      aria-label={label}
      className={cx('as-icon-button', className)}
      size={size}
      variant={variant}
    >
      <span aria-hidden="true">{icon}</span>
    </Button>
  );
}
