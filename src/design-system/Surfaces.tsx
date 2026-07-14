import type { HTMLAttributes, ReactNode } from 'react';
import type { AsBaseProps, AsTone } from './types';
import { cx, toneClass } from './types';

export interface CardProps extends HTMLAttributes<HTMLElement>, AsBaseProps {
  tone?: AsTone;
  interactive?: boolean;
}

export function Card({
  children,
  className,
  interactive = false,
  tone = 'neutral',
  ...props
}: CardProps) {
  return (
    <article
      {...props}
      className={cx('as-card', toneClass(tone), interactive && 'as-card-action', className)}
    >
      {children}
    </article>
  );
}

export interface PanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    AsBaseProps {
  title?: ReactNode;
  actions?: ReactNode;
}

export function Panel({ actions, children, className, title, ...props }: PanelProps) {
  return (
    <section {...props} className={cx('as-panel', className)}>
      {(title || actions) && (
        <div className="as-panel-header">
          {title && <h2 className="as-panel-title">{title}</h2>}
          {actions && <div className="as-panel-actions">{actions}</div>}
        </div>
      )}
      <div className="as-panel-body">{children}</div>
    </section>
  );
}

export interface HeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  title,
  ...props
}: HeaderProps) {
  return (
    <header {...props} className={cx('as-page-header', className)}>
      <div className="as-header-copy">
        {eyebrow && <p className="as-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="as-header-actions">{actions}</div>}
    </header>
  );
}

export function SectionHeader({
  actions,
  className,
  description,
  eyebrow,
  title,
  ...props
}: HeaderProps) {
  return (
    <div {...props} className={cx('as-section-header', className)}>
      <div className="as-header-copy">
        {eyebrow && <p className="as-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="as-header-actions">{actions}</div>}
    </div>
  );
}
