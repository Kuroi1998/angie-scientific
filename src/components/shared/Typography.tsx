import React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

export const PageTitle: React.FC<TypographyProps> = ({ children, as: Component = 'h1', style, ...props }) => {
  return (
    <Component style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 1rem 0', ...style }} {...props}>
      {children}
    </Component>
  );
};

export const SectionTitle: React.FC<TypographyProps> = ({ children, as: Component = 'h2', style, ...props }) => {
  return (
    <Component style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1rem 0', ...style }} {...props}>
      {children}
    </Component>
  );
};

export const CardTitle: React.FC<TypographyProps> = ({ children, as: Component = 'h3', style, ...props }) => {
  return (
    <Component style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem 0', ...style }} {...props}>
      {children}
    </Component>
  );
};

export const BodyText: React.FC<TypographyProps> = ({ children, as: Component = 'p', style, ...props }) => {
  return (
    <Component style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: '0 0 1rem 0', ...style }} {...props}>
      {children}
    </Component>
  );
};

export const SecondaryText: React.FC<TypographyProps> = ({ children, as: Component = 'span', style, ...props }) => {
  return (
    <Component style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)', ...style }} {...props}>
      {children}
    </Component>
  );
};

export const MutedText: React.FC<TypographyProps> = ({ children, as: Component = 'span', style, ...props }) => {
  return (
    <Component style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-muted)', ...style }} {...props}>
      {children}
    </Component>
  );
};

export const ScientificValue: React.FC<TypographyProps> = ({ children, as: Component = 'span', style, ...props }) => {
  return (
    <Component style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, ...style }} {...props}>
      {children}
    </Component>
  );
};
