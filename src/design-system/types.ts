import type { ReactNode } from 'react';

export type AsTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

export type AsSize = 'sm' | 'md' | 'lg';
export type AsVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type AsStatus = 'normal' | 'error' | 'success';

export interface AsBaseProps {
  className?: string;
  children?: ReactNode;
}

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function toneClass(tone: AsTone) {
  return `as-tone-${tone}`;
}

export function sizeClass(size: AsSize) {
  return `as-size-${size}`;
}

export function variantClass(variant: AsVariant) {
  return `as-variant-${variant}`;
}
