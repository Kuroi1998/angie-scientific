import type { ConsoleMessage, Page } from '@playwright/test';

export interface PageErrors {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
}

export function trackPageErrors(page: Page): PageErrors {
  const errors: PageErrors = { consoleErrors: [], pageErrors: [], failedRequests: [] };

  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      errors.consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.pageErrors.push(err.message);
  });

  page.on('requestfailed', (req) => {
    const failureText = req.failure()?.errorText ?? '';
    if (
      !req.url().includes('/@vite/')
      && !req.url().includes('ws:')
      && !failureText.includes('net::ERR_ABORTED')
    ) {
      errors.failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
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

export async function selectLanguage(page: Page, lang: 'fr' | 'es' = 'fr') {
  const button = page.getByRole('button', { name: lang === 'fr' ? /FRAN/i : /ESPA/i }).first();
  if (await button.isVisible().catch(() => false)) {
    await button.click();
  }
}

export async function seedAuthenticatedUser(page: Page, tab = 'home') {
  await page.addInitScript(([activeTab]) => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    const userId = 'e2e_user';
    const profile = {
      activeTheme: 'dark',
      globalSoundEnabled: false,
      id: userId,
      learningLevel: 'discovery',
      mascotEnabled: false,
      mascotSoundEnabled: false,
      reducedMotion: false,
      username: 'E2E',
    };
    const progress = {
      completedQuests: [],
      discoveredElements: ['H', 'He'],
      experiencePoints: 120,
      solvedRiddles: [],
      successfulReactions: [],
      unlockedBadges: [],
      userId,
    };
    localStorage.setItem('angie_scientific_user_id', userId);
    if (!localStorage.getItem('angie_scientific_profiles')) {
      localStorage.setItem('angie_scientific_profiles', JSON.stringify({ [userId]: profile }));
    }
    if (!localStorage.getItem('angie_scientific_progress')) {
      localStorage.setItem('angie_scientific_progress', JSON.stringify({ [userId]: progress }));
    }
    if (!localStorage.getItem('angieScientific:v1:language')) {
      localStorage.setItem('angieScientific:v1:language', JSON.stringify('fr'));
    }
    if (!localStorage.getItem('angieScientific:v1:activeTab')) {
      localStorage.setItem('angieScientific:v1:activeTab', JSON.stringify(activeTab));
    }
  }, [tab]);
}

export async function openApp(page: Page, tab = 'home') {
  await seedAuthenticatedUser(page, tab);
  await page.goto('/');
  await dismissGlobalNotification(page);
}

export async function openSection(page: Page, name: RegExp | string) {
  await page.getByRole('button', { name }).first().click();
}

export async function dismissGlobalNotification(page: Page) {
  await page
    .getByRole('button', { name: 'Fermer la notification' })
    .click({ timeout: 3000 })
    .catch(() => undefined);
}
