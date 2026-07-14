import type { HTMLAttributes, ReactNode } from 'react';
import type { AsBaseProps, AsSize, AsTone } from './types';
import { cx, sizeClass, toneClass } from './types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AsSize;
  tone?: AsTone;
}

export function Badge({
  children,
  className,
  size = 'sm',
  tone = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span {...props} className={cx('as-badge', toneClass(tone), sizeClass(size), className)}>
      {children}
    </span>
  );
}

export interface ProgressBarProps {
  label: ReactNode;
  max?: number;
  tone?: AsTone;
  value: number;
}

export function ProgressBar({ label, max = 100, tone = 'accent', value }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, max));
  return (
    <div className="as-progress">
      <div className="as-progress-header">
        <span>{label}</span>
        <span>{Math.round((safeValue / max) * 100)}%</span>
      </div>
      <div
        aria-label={String(label)}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className={cx('as-progress-track', toneClass(tone))}
        role="progressbar"
      >
        <span style={{ width: `${(safeValue / max) * 100}%` }} />
      </div>
    </div>
  );
}

export interface AlertProps extends AsBaseProps {
  title?: ReactNode;
  tone?: AsTone;
}

export function Alert({ children, className, title, tone = 'info' }: AlertProps) {
  return (
    <div className={cx('as-alert', toneClass(tone), className)} role="status">
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('as-skeleton', className)} aria-hidden="true" />;
}

export interface StateProps extends AsBaseProps {
  action?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}

export function EmptyState({ action, children, className, icon, title }: StateProps) {
  return (
    <div className={cx('as-state', className)}>
      {icon && <div className="as-state-icon">{icon}</div>}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ action, children, className, icon, title }: StateProps) {
  return (
    <div className={cx('as-state as-state-error', className)} role="alert">
      {icon && <div className="as-state-icon">{icon}</div>}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ children = 'Loading scientific data...', className }: AsBaseProps) {
  return (
    <div className={cx('as-loading-state', className)} role="status">
      <span className="as-spinner" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export interface ToastProps extends AsBaseProps {
  action?: ReactNode;
  title?: ReactNode;
  tone?: AsTone;
}

export function Toast({ action, children, className, title, tone = 'neutral' }: ToastProps) {
  return (
    <div className={cx('as-toast', toneClass(tone), className)} role="status">
      <div>
        {title && <strong>{title}</strong>}
        {children && <p>{children}</p>}
      </div>
      {action}
    </div>
  );
}
