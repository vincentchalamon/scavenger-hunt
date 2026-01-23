import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Security/API Key page
 */
export class SecurityPage extends BasePage {
  readonly slug: string;

  constructor(page: Page, slug: string = 'le-tresor-du-vieux-lille') {
    super(page);
    this.slug = slug;
  }

  /**
   * Navigate to the hunt with the slug
   */
  async goto() {
    await this.page.goto(`/${this.slug}`, { waitUntil: 'networkidle', timeout: 30000 });
  }

  /**
   * Get the API key input field
   */
  get apiKeyInput() {
    return this.page.getByPlaceholder('Clé d\'accès');
  }

  /**
   * Get the save button
   */
  get saveButton() {
    return this.page.getByRole('button', { name: 'Enregistrer', exact: true });
  }

  /**
   * Enter and save the API key
   */
  async enterApiKey(apiKey: string) {
    await expect(this.apiKeyInput).toBeVisible({ timeout: 15000 });
    await this.apiKeyInput.fill(apiKey);
    await this.wait(300);
    await this.saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.saveButton.click();
  }

  /**
   * Verify the security page is not visible (user is authenticated)
   */
  async verifyAuthenticated() {
    await expect(this.apiKeyInput).not.toBeVisible({ timeout: 5000 });
  }
}
