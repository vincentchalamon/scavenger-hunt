import {expect, Page} from '@playwright/test';

/**
 * Base Page Object for common functionality across all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for a specific duration
   */
  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Close all visible modals
   */
  async closeAllModals() {
    const modals = this.page.getByTestId('modal');
    const count = await modals.count();
    for (let i = 0; i < count; i++) {
      try {
        const modal = modals.nth(i);
        if (await modal.isVisible()) {
          const closeBtn = modal.getByTestId('modal-close');
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await modal.waitFor({ state: 'hidden', timeout: 3000 });
          }
        }
      } catch {
        // Ignore if modal is already closed
      }
    }
  }

  /**
   * Dismiss the "keyword found" celebration overlay if present
   */
  async dismissMoment() {
    try {
      const overlay = this.page.getByTestId('keyword-found');
      if (await overlay.isVisible().catch(() => false)) {
        await this.page.getByTestId('moment-continue').click();
        await expect(overlay).not.toBeVisible({ timeout: 5000 });
      }
    } catch {
      // Overlay may have already been dismissed
    }
  }

  /**
   * Wait for a modal to be ready and stable
   */
  async waitForModalReady() {
    const modal = this.page.getByTestId('modal');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await this.wait(800); // Wait for animations to complete
    await modal.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Close the current modal
   */
  async closeModal() {
    const modal = this.page.getByTestId('modal');
    const modalClose = modal.getByTestId('modal-close');
    await modalClose.waitFor({ state: 'visible', timeout: 3000 });
    await modalClose.click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  }
}
