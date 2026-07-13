import { test, expect } from '@playwright/test';
import { trackPageErrors, assertNoErrors, selectLanguage } from './helpers';

// Each Playwright test already runs in its own fresh, isolated browser
// context (separate localStorage) by default — no manual clearing needed,
// and doing so via addInitScript would also wipe state on every reload
// within a test, breaking the persistence-across-reload scenario.

test.describe('Angie Scientific — critical path', () => {
  test('loads the app, shows the periodic table, no console/page/network errors', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');
    await selectLanguage(page, 'fr');

    await expect(page.getByRole('heading', { name: 'ANGIE SCIENTIFIC' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Hydrogène/ })).toBeVisible();

    assertNoErrors(errors);
  });

  test('hovering/selecting Hélium opens the detail card and the Bohr atomic model canvas renders without crashing', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');
    await selectLanguage(page, 'fr');

    await page.getByRole('button', { name: /Hélium/ }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('canvas').first()).toBeVisible();

    assertNoErrors(errors);

    // Escape closes the modal and returns focus to the trigger.
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: /Hélium/ })).toBeFocused();
  });

  test('quantum visualizer: hybridization orbital states render their canvas without crashing (regression for the addColorStop(var(--...)) bug)', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');
    await selectLanguage(page, 'fr');

    await page.getByRole('tab', { name: /VISUALISEUR QUANTIQUE/ }).click();
    await page.getByRole('button', { name: /ÉTATS D'HYBRIDATION/ }).click();
    await expect(page.locator('canvas').first()).toBeVisible();

    await page.getByRole('button', { name: 'SP3' }).click();
    await expect(page.getByText('109.5°')).toBeVisible();

    assertNoErrors(errors);
  });

  test('fusion simulator: H + O reaction renders a securely-rendered (JSX) equation with real subscripts', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');
    await selectLanguage(page, 'fr');

    await page.getByRole('tab', { name: /SIMULATEUR DE FUSION/ }).click();
    await page.getByRole('button', { name: 'H', exact: true }).click();
    await page.getByRole('button', { name: 'O', exact: true }).click();

    await expect(page.getByText('Eau / Agua (H₂O)')).toBeVisible();
    // The equation must be built from real <sub> elements, not injected HTML.
    await expect(page.locator('sub').first()).toBeVisible();
    const dangerousNodes = await page.evaluate(() =>
      document.querySelectorAll('[dangerouslySetInnerHTML]').length
    );
    expect(dangerousNodes).toBe(0);

    assertNoErrors(errors);
  });

  test('virtual lab: running an experiment announces progress/completion via aria-live and persists it', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');
    await selectLanguage(page, 'fr');

    await page.getByRole('tab', { name: /LABO VIRTUEL/ }).click();
    const status = page.getByRole('status');
    await page.getByRole('button', { name: /LANCER L'EXPÉRIENCE/ }).click();
    await expect(status).toContainText(/en cours/i);
    await expect(status).toContainText(/terminée/i, { timeout: 5000 });

    const stored = await page.evaluate(() =>
      window.localStorage.getItem('angieScientific:v1:virtualLabCompletedExperiments')
    );
    expect(stored).toContain('h2o');

    assertNoErrors(errors);
  });

  test('language switch and active tab both survive a full page reload', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');
    await selectLanguage(page, 'fr');

    await page.getByRole('tab', { name: /LABO VIRTUEL/ }).click();
    // The language button shows the CURRENT language and toggles on click.
    await page.getByRole('button', { name: 'FRANÇAIS' }).click();

    await page.reload();
    await expect(page.getByRole('button', { name: /INICIAR EXPERIMENTO/i })).toBeVisible();

    assertNoErrors(errors);
  });

  test('main navigation is fully keyboard-operable (arrow keys move focus and switch tabs)', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.goto('/');
    await selectLanguage(page, 'fr');

    await page.locator('#main-tab-table').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#main-tab-fusion')).toBeFocused();
    await expect(page.locator('#main-tab-fusion')).toHaveAttribute('aria-selected', 'true');

    assertNoErrors(errors);
  });

  test('corrupted localStorage does not crash the app on load', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.addInitScript(() => {
      window.localStorage.setItem('angieScientific:v1:activeTab', '{not valid json');
      window.localStorage.setItem('angieScientific:v1:questProgress', '{"not":"an array"}');
    });
    await page.goto('/');
    await selectLanguage(page, 'fr');

    await expect(page.getByRole('button', { name: /Hydrogène/ })).toBeVisible();
    assertNoErrors(errors);
  });

  test('mobile viewport (320x568): periodic table scrolls horizontally without the page itself overflowing', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const errors = trackPageErrors(page);
    await page.goto('/');
    await selectLanguage(page, 'fr');

    const overflow = await page.evaluate(() => document.body.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);

    assertNoErrors(errors);
  });

  test('no essential resource returns a 404', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (res) => {
      if (res.status() === 404) failed.push(res.url());
    });
    await page.goto('/');
    await selectLanguage(page, 'fr');
    await page.getByRole('tab', { name: /LAB PHYSIQUE-CHIMIE/ }).click();
    await page.getByRole('tab', { name: /VISUALISEUR QUANTIQUE/ }).click();
    expect(failed).toEqual([]);
  });
});
