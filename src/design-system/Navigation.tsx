import { useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { AsTone } from './types';
import { cx, toneClass } from './types';

export interface TabItem {
  content?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: ReactNode;
}

export interface TabsProps {
  ariaLabel: string;
  items: TabItem[];
  onChange?: (id: string) => void;
  value: string;
}

export function Tabs({ ariaLabel, items, onChange, value }: TabsProps) {
  const active = items.find((item) => item.id === value) ?? items[0];
  return (
    <div className="as-tabs">
      <div aria-label={ariaLabel} className="as-tab-list" role="tablist">
        {items.map((item, index) => (
          <button
            aria-controls={`as-panel-${item.id}`}
            aria-selected={value === item.id}
            className="as-tab"
            disabled={item.disabled}
            id={`as-tab-${item.id}`}
            key={item.id}
            onClick={() => onChange?.(item.id)}
            onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
              event.preventDefault();
              const delta = event.key === 'ArrowRight' ? 1 : -1;
              const next = (index + delta + items.length) % items.length;
              document.getElementById(`as-tab-${items[next].id}`)?.focus();
            }}
            role="tab"
            type="button"
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`as-tab-${active.id}`}
        className="as-tab-panel"
        id={`as-panel-${active.id}`}
        role="tabpanel"
      >
        {active.content}
      </div>
    </div>
  );
}

export interface NavigationItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  badge?: ReactNode;
  icon?: ReactNode;
  label: ReactNode;
}

export function NavigationItem({
  active = false,
  badge,
  className,
  icon,
  label,
  type = 'button',
  ...props
}: NavigationItemProps) {
  return (
    <button
      {...props}
      aria-current={active ? 'page' : undefined}
      className={cx('as-nav-item', active && 'is-active', className)}
      type={type}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
      {badge && <span className="as-nav-badge">{badge}</span>}
    </button>
  );
}

export interface BreadcrumbItem {
  href?: string;
  label: ReactNode;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="as-breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {item.href && index < items.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface DropdownItem {
  disabled?: boolean;
  label: ReactNode;
  onSelect: () => void;
  tone?: AsTone;
}

export interface DropdownProps {
  items: DropdownItem[];
  label: ReactNode;
  variant?: 'solid' | 'outline' | 'ghost' | 'soft';
}

export function Dropdown({ items, label, variant = 'outline' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="as-dropdown">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className={cx("as-button", `as-variant-${variant}`, "as-tone-neutral", "as-size-md")}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {label}
      </button>
      {open && (
        <div className="as-menu" role="menu">
          {items.map((item, index) => (
            <button
              className={cx('as-menu-item', toneClass(item.tone ?? 'neutral'))}
              disabled={item.disabled}
              key={index}
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              role="menuitem"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
