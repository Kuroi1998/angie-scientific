import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { LanguageProvider } from './hooks/useLanguage';

/** Renders `ui` wrapped in LanguageProvider, since most components call useLanguage(). */
export function renderWithLanguage(ui: React.ReactElement, options?: RenderOptions) {
  return render(<LanguageProvider>{ui}</LanguageProvider>, options);
}
