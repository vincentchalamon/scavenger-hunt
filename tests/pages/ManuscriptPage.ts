import {expect, Page} from '@playwright/test';
import {BasePage} from './BasePage';

/**
 * Page Object for the Manuscript view
 */
export class ManuscriptPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the manuscript tab button
   */
  get manuscriptButton() {
    return this.page.getByTestId('manuscript-button');
  }

  /**
   * Get the manuscript content
   */
  get manuscript() {
    return this.page.getByTestId('manuscript');
  }

  /**
   * Navigate to the manuscript tab
   */
  async navigateToManuscript() {
    await this.manuscriptButton.click();
    await this.wait(500);
  }

  /**
   * Verify the manuscript contains specific text
   */
  async verifyText(text: string | RegExp) {
    await expect(this.manuscript).toContainText(text, { timeout: 5000 });
  }

  /**
   * Verify the manuscript tab is active
   */
  async verifyTabActive() {
    await expect(this.manuscriptButton).toHaveClass(/active/);
    await expect(this.manuscript).toBeVisible();
  }

  /**
   * Get the current manuscript text content
   */
  async getText(): Promise<string> {
    return (await this.manuscript.textContent()) || '';
  }

  /**
   * Verify no placeholder dots remain in the phrase
   */
  async verifyPhraseComplete() {
    const text = await this.getText();
    expect(text).not.toContain('····');
  }

  /**
   * Verify specific clue texts are present
   */
  async verifyClues(...clues: string[]) {
    for (const clue of clues) {
      await this.verifyText(clue);
    }
  }
}
