import { Page, expect } from '@playwright/test';

/**
 * Base Page Object for common functionality across all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the application
   */
  async goto() {
    await this.page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
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
          const closeBtn = modal.locator('.btn-close');
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await modal.waitFor({ state: 'hidden', timeout: 3000 });
          }
        }
      } catch (e) {
        // Ignore if modal is already closed
      }
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
   * Close a toast notification
   */
  async closeToast() {
    try {
      const toast = this.page.getByTestId('toast');
      if (await toast.isVisible()) {
        const toastClose = toast.locator('.btn-close');
        await toastClose.waitFor({ state: 'visible', timeout: 3000 });
        await toastClose.click();
        await expect(toast).not.toBeVisible({ timeout: 3000 });
      }
    } catch (e) {
      // Toast may have already disappeared
    }
  }

  /**
   * Verify a success toast appears with specific message (supports regex)
   */
  async verifySuccessToast(message?: string | RegExp) {
    const toast = this.page.getByTestId('toast');
    await expect(toast).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(toast).toHaveText(message, { timeout: 5000 });
    }
  }

  /**
   * Close the current modal
   */
  async closeModal() {
    const modal = this.page.getByTestId('modal');
    const modalClose = modal.locator('.btn-close');
    await modalClose.waitFor({ state: 'visible', timeout: 3000 });
    await modalClose.click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  }
}
