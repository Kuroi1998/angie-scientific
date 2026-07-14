import type { ReactNode } from 'react';
import { Badge } from '../../design-system';
import './lab-station.css';

interface LabStationProps {
  actions?: ReactNode;
  children: ReactNode;
  eyebrow: string;
  metrics?: Array<{
    label: string;
    value: ReactNode;
    tone?: 'neutral' | 'info' | 'success' | 'warning' | 'error';
  }>;
  subtitle: ReactNode;
  title: ReactNode;
}

interface StationPanelProps {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title: ReactNode;
}

export function LabStation({
  actions,
  children,
  eyebrow,
  metrics = [],
  subtitle,
  title,
}: LabStationProps) {
  return (
    <div className="lab-station">
      <header className="lab-station-header">
        <div>
          <p className="as-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {actions && <div className="lab-station-actions">{actions}</div>}
      </header>
      {metrics.length > 0 && (
        <div className="lab-station-metrics" aria-label="Indicateurs de laboratoire">
          {metrics.map((metric) => (
            <div className="lab-metric" key={metric.label}>
              <span>{metric.label}</span>
              <Badge tone={metric.tone ?? 'neutral'}>{metric.value}</Badge>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

export function StationPanel({
  actions,
  children,
  className,
  eyebrow,
  title,
}: StationPanelProps) {
  return (
    <section className={['lab-panel', className].filter(Boolean).join(' ')}>
      <div className="lab-panel-header">
        <div>
          {eyebrow && <p className="as-eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
        {actions && <div className="lab-panel-actions">{actions}</div>}
      </div>
      <div className="lab-panel-body">{children}</div>
    </section>
  );
}

export function LabReadout({
  label,
  tone = 'neutral',
  value,
}: {
  label: string;
  tone?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  value: ReactNode;
}) {
  return (
    <div className="lab-readout">
      <span>{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  );
}

export function SafetyList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="lab-safety-list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
