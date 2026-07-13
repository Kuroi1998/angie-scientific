import type { Page, ConsoleMessage } from '@playwright/test';

export interface PageErrors {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
}

/**
 * Attaches listeners that collect console errors, uncaught exceptions and
 * failed network requests for the lifetime of `page`. Call assertNoErrors()
 * (or inspect the arrays directly) at the point in the test where the app
 * should be in a clean state.
 */
export function trackPageErrors(page: Page): PageErrors {
  const errors: PageErrors = { consoleErrors: [], pageErrors: [], failedRequests: [] };

  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      // The React DevTools promo is logged via console.info, never console.error,
      // so nothing needs to be allow-listed here — any console.error is a real signal.
      errors.consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.pageErrors.push(err.message);
  });

  page.on('requestfailed', (req) => {
    // Vite's dev/preview HMR websocket probing can appear as a "failed" request
    // in some environments; everything else is a genuine broken resource.
    if (!req.url().includes('/@vite/') && !req.url().includes('ws:')) {
      errors.failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
    }
  });

  return errors;
}

export function assertNoErrors(errors: PageErrors) {
  const problems: string[] = [];
  if (errors.consoleErrors.length) problems.push(`Console errors: ${errors.consoleErrors.join(' | ')}`);
  if (errors.pageErrors.length) problems.push(`Uncaught exceptions: ${errors.pageErrors.join(' | ')}`);
  if (errors.failedRequests.length) problems.push(`Failed requests: ${errors.failedRequests.join(' | ')}`);
  if (problems.length) throw new Error(problems.join('\n'));
}

/** Dismisses the language welcome gate so the rest of the UI becomes interactive. */
export async function selectLanguage(page: Page, lang: 'fr' | 'es' = 'fr') {
  const button = page.getByRole('button', { name: lang === 'fr' ? 'FRANÇAIS' : 'ESPAÑOL' }).first();
  if (await button.isVisible().catch(() => false)) {
    await button.click();
  }
}
