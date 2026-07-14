import { expect, test } from '@playwright/test';
import {
  assertNoErrors,
  dismissGlobalNotification,
  openApp,
  openSection,
  trackPageErrors,
} from './helpers';

test.describe('Angie Scientific critical path', () => {
  test('loads the dashboard and opens the redesigned periodic table', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page);

    await expect(page.getByRole('heading', { name: 'Accueil' })).toBeVisible();
    await openSection(page, /Tableau/);
    await expect(page.locator('#app-shell-page-title')).toHaveText(/Tableau/);
    await expect(page.getByRole('button', { name: /Hydrog/i })).toBeVisible();

    assertNoErrors(errors);
  });

  test('opens an element side panel and the full detail modal canvas', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page, 'table');

    await page.getByRole('button', { name: /H.lium/ }).click();
    await expect(page.getByRole('heading', { name: /H.lium/ })).toBeVisible();
    await page.getByRole('button', { name: /Fiche compl/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('canvas').first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    assertNoErrors(errors);
  });

  test('periodic table search filters visible elements', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page, 'table');

    await page.getByRole('textbox', { name: 'Recherche' }).fill('Oganesson');
    await expect(page.getByRole('button', { name: /Oganesson/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Hydrog/i })).toBeDisabled();

    assertNoErrors(errors);
  });

  test('favorite and comparison actions update the element panel', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page, 'table');

    await page.getByRole('button', { name: /Hydrog/i }).click();
    await page.getByRole('button', { name: 'Ajouter favori' }).click();
    await expect(page.getByRole('button', { name: 'Retirer favori' })).toBeVisible();
    await page.getByRole('button', { name: 'Comparer' }).click();
    await expect(page.getByRole('heading', { name: 'H', exact: true })).toBeVisible();

    assertNoErrors(errors);
  });

  test('quantum visualizer still renders its canvas', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page);

    await openSection(page, /Visualiseur Quantique/);
    await page.locator('main').getByRole('button', { name: 'Hybridation' }).click();
    await expect(page.locator('canvas').first()).toBeVisible();
    await page.getByRole('button', { name: 'sp3' }).click();
    await expect(page.getByText(/109.5/)).toBeVisible();

    assertNoErrors(errors);
  });

  test('fusion simulator renders a secured equation with real subscripts', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page);

    await openSection(page, /Simulateur de Fusion/);
    await page.getByRole('button', { name: 'H', exact: true }).click();
    await page.getByRole('button', { name: 'O', exact: true }).click();

    await expect(page.getByText(/Eau \/ Agua/)).toBeVisible();
    await expect(page.locator('sub').first()).toBeVisible();
    const dangerousNodes = await page.evaluate(() =>
      document.querySelectorAll('[dangerouslySetInnerHTML]').length
    );
    expect(dangerousNodes).toBe(0);

    assertNoErrors(errors);
  });

  test('virtual lab announces experiment progress and persists completion', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page);

    await openSection(page, /Labo Virtuel/);
    const status = page.getByRole('status', { name: 'Statut du labo virtuel' });
    await page.getByRole('button', { name: /Lancer l.experience/i }).click();
    await expect(status).toContainText(/en cours/i);
    await expect(status).toContainText(/terminee|termin.e/i, { timeout: 5000 });

    const stored = await page.evaluate(() =>
      window.localStorage.getItem('angieScientific:v1:virtualLabCompletedExperiments')
    );
    expect(stored).toContain('h2o');
    assertNoErrors(errors);
  });

  test('quiz flow validates an answer and shows correction feedback', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page, 'quiz');

    await expect(page.getByRole('heading', { name: 'Quiz, devinettes et examens' })).toBeVisible();
    await page.getByRole('button', { name: 'Commencer' }).click();
    await expect(page.getByRole('heading', { name: 'Choix de reponse' })).toBeVisible();
    await page.locator('.quiz-answer').first().click();
    await dismissGlobalNotification(page);
    await page.getByRole('button', { name: 'Valider' }).click();
    await expect(page.getByRole('status').filter({ hasText: /Bonne reponse|Mauvaise reponse/ })).toBeVisible();

    assertNoErrors(errors);
  });

  test('profile center updates user preferences', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page, 'profile');

    await expect(page.getByRole('heading', { name: /Profil et progression de E2E/ })).toBeVisible();
    await page.getByRole('tab', { name: 'Parametres' }).click();
    const soundSwitch = page.getByRole('switch', { name: 'Effets sonores globaux' });
    await expect(soundSwitch).not.toBeChecked();
    await soundSwitch.click();
    await expect(soundSwitch).toBeChecked();
    await expect.poll(() =>
      page.evaluate(() => window.localStorage.getItem('angie_scientific_profiles'))
    ).toContain('"globalSoundEnabled":true');

    assertNoErrors(errors);
  });

  test('active section survives reload', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page);

    await openSection(page, /Labo Virtuel/);
    await page.reload();
    await expect(page.locator('#app-shell-page-title')).toHaveText('Labo Virtuel');

    assertNoErrors(errors);
  });

  test('main navigation is keyboard operable', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page);

    await page.locator('#app-route-home').focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#app-route-profile')).toBeFocused();
    await expect(page.getByRole('heading', { name: 'Profil', exact: true })).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#app-route-table')).toBeFocused();
    await expect(page.locator('#app-shell-page-title')).toHaveText(/Tableau/);

    assertNoErrors(errors);
  });

  test('mobile viewport has no document-level horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const errors = trackPageErrors(page);
    await openApp(page, 'table');

    const overflow = await page.evaluate(() =>
      document.body.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(2);
    assertNoErrors(errors);
  });

  test('no essential resource returns a 404', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (response) => {
      if (response.status() === 404) failed.push(response.url());
    });

    await openApp(page);
    await openSection(page, /Lab Physique-Chimie/);
    await openSection(page, /Visualiseur Quantique/);
    expect(failed).toEqual([]);
  });

  test('theme toggle switches the applied theme and persists across reload', async ({ page }) => {
    const errors = trackPageErrors(page);
    await openApp(page);

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('button', { name: /Changer le th.me/i }).click();
    await page.getByRole('menuitem', { name: /^Clair/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await dismissGlobalNotification(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    assertNoErrors(errors);
  });
});
