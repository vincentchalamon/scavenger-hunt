import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

/**
 * Interface i18n tests — assert UI strings match the browser locale and that
 * a localStorage override wins over navigator.language.
 *
 * Browser locale is controlled per Playwright project (fr-FR or en-US).
 */

const isEnglish = (locale?: string) => locale?.startsWith('en') ?? false;

test.describe('Interface i18n', () => {
  test('Home page UI follows browser locale', async ({page}, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    const expectedTitle = en ? 'Available Routes' : 'Parcours disponibles';
    const forbiddenTitle = en ? 'Parcours disponibles' : 'Available Routes';
    await expect(page.getByRole('heading', {name: expectedTitle})).toBeVisible({timeout: 10000});
    await expect(page.getByRole('heading', {name: forbiddenTitle})).not.toBeVisible();

    const expectedStart = en ? 'Start' : 'Commencer';
    const startLink = page.getByRole('link', {name: expectedStart}).first();
    await expect(startLink).toBeVisible();
  });

  test('Hunt page tabs follow browser locale', async ({page}, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');

    const rulesLabel = en ? 'Rules' : 'Règles';
    const manuscriptLabel = en ? 'Manuscript' : 'Manuscrit';
    const mapLabel = en ? 'Map' : 'Carte';

    await expect(page.getByTestId('rules-button')).toContainText(rulesLabel);
    await expect(page.getByTestId('manuscript-button')).toContainText(manuscriptLabel);
    await expect(page.getByTestId('map-button')).toContainText(mapLabel);
  });

  test('404 page follows browser locale', async ({page}, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/invalid-hunt-url');

    const expectedTitle = en ? '404 - Hunt Not Found' : '404 - Jeu introuvable';
    await expect(page.getByRole('heading', {name: expectedTitle})).toBeVisible({timeout: 10000});

    const expectedBack = en ? 'Back to hunts list' : 'Retour à la liste des jeux';
    await expect(page.getByRole('link', {name: expectedBack})).toBeVisible();
  });

  test('localStorage language preference wins over navigator.language', async ({page}) => {
    // Regardless of project locale, force English via localStorage and assert UI is English.
    await page.addInitScript(() => {
      window.localStorage.setItem('language', 'en');
    });

    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    await expect(page.getByRole('heading', {name: 'Available Routes'})).toBeVisible({timeout: 10000});
    await expect(page.getByRole('heading', {name: 'Parcours disponibles'})).not.toBeVisible();
  });

  test('Map popup CTA uses translated marker strings', async ({page}, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');

    await app.map.navigateToMap();
    await page.waitForTimeout(2000);
    await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible({timeout: 10000});
    await page.locator('.leaflet-marker-icon').first().click();

    const popup = page.locator('.leaflet-popup-content');
    await expect(popup).toBeVisible({timeout: 5000});

    const expectedInstructions = en
      ? 'Go to the location, then tap the image below'
      : 'Allez sur place, puis cliquez sur l\'image ci-dessous';
    await expect(popup).toContainText(expectedInstructions);

    const expectedLinkLabel = en ? 'Discover its story' : 'Découvrez son histoire';
    const forbiddenLinkLabel = en ? 'Découvrez son histoire' : 'Discover its story';
    await expect(popup.getByRole('link', {name: expectedLinkLabel})).toBeVisible();
    await expect(popup.getByRole('link', {name: forbiddenLinkLabel})).not.toBeVisible();
  });
});
