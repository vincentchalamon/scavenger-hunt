import {expect} from '@playwright/test';
import {BasePage} from './BasePage';

/**
 * Base class for all clue/puzzle solvers
 */
export abstract class ClueBasePage extends BasePage {
  /**
   * Get the modal element
   */
  get modal() {
    return this.page.getByTestId('modal');
  }

  /**
   * Solve the clue - must be implemented by each clue type
   */
  abstract solve(): Promise<void>;

  /**
   * Complete the full flow: solve the clue, verify success, close modal
   */
  async solveAndClose(_expectedMessage?: string | RegExp) {
    await this.solve();

    // Dismiss the "mot trouvé" celebration overlay, then close the modal
    await this.dismissMoment();
    await this.closeModal();
  }
}

/**
 * Clue solver for clickable image (keyword button)
 */
export class ClickableImageClue extends ClueBasePage {
  async solve() {
    // Verify image is visible
    await expect(this.modal.locator('img')).toBeVisible({ timeout: 10000 });

    // Wait for keyword button to be visible
    const keywordButton = this.modal.getByTestId('keyword-button');
    await keywordButton.waitFor({ state: 'visible', timeout: 5000 });

    // Click on the keyword button to validate
    await keywordButton.click();
    await this.wait(500);
  }

  /**
   * Click on a specific area of the clickable image
   * Position is relative to the image (e.g., {x: 0.9, y: 0.1} for top-right corner)
   */
  async clickArea(relativeX: number, relativeY: number) {
    // Get the main image in the modal
    const image = this.modal.locator('img').first();
    await expect(image).toBeVisible({ timeout: 10000 });

    const imageBox = await image.boundingBox();
    if (!imageBox) {
      throw new Error('Image not found');
    }

    // Calculate absolute position
    const clickX = imageBox.x + imageBox.width * relativeX;
    const clickY = imageBox.y + imageBox.height * relativeY;

    // Click on the area
    await this.page.mouse.click(clickX, clickY);
    await this.wait(1000); // Increased wait time for image modal to appear
  }

  /**
   * Click on an area to view an image clue, verify it, then close it
   */
  async viewImageInArea(relativeX: number, relativeY: number, expectedImageSrc?: string) {
    await this.clickArea(relativeX, relativeY);

    // Wait for nested modal to appear
    const nestedModal = this.page.locator('[data-testid="modal"]').nth(1);
    await expect(nestedModal).toBeVisible({ timeout: 5000 });

    // Verify image is displayed
    const image = nestedModal.locator('img');
    await expect(image).toBeVisible({ timeout: 5000 });

    if (expectedImageSrc) {
      await expect(image).toHaveAttribute('src', new RegExp(expectedImageSrc));
    }

    // Close the nested modal
    const closeButton = nestedModal.getByTestId('modal-close');
    await closeButton.click();
    await this.wait(500);
  }
}

/**
 * Clue solver for scratch card
 */
export class ScratchCardClue extends ClueBasePage {
  async solve() {
    const canvas = this.modal.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
    await this.wait(1000);

    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) {
      throw new Error('Canvas not found');
    }

    // Scratch a larger area to ensure at least 80% is revealed
    // We'll scratch the entire canvas area with dense patterns
    const startX = canvasBox.x + 10;
    const startY = canvasBox.y + 10;
    const scratchWidth = canvasBox.width - 20;
    const scratchHeight = canvasBox.height - 20;

    // Dense horizontal scratching across the entire canvas
    const numHorizontalRows = 30;
    for (let row = 0; row < numHorizontalRows; row++) {
      const y = startY + (scratchHeight / numHorizontalRows) * row;
      await this.page.mouse.move(startX, y);
      await this.page.mouse.down();
      await this.page.mouse.move(startX + scratchWidth, y, { steps: 15 });
      await this.page.mouse.up();
      await this.wait(30);
    }

    // Dense vertical scratching across the entire canvas
    const numVerticalCols = 25;
    for (let col = 0; col < numVerticalCols; col++) {
      const x = startX + (scratchWidth / numVerticalCols) * col;
      await this.page.mouse.move(x, startY);
      await this.page.mouse.down();
      await this.page.mouse.move(x, startY + scratchHeight, { steps: 12 });
      await this.page.mouse.up();
      await this.wait(30);
    }

    // Diagonal scratching for complete coverage
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + scratchWidth, startY + scratchHeight, { steps: 20 });
    await this.page.mouse.up();

    await this.page.mouse.move(startX + scratchWidth, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX, startY + scratchHeight, { steps: 20 });
    await this.page.mouse.up();

    await this.wait(2000);
  }

  /**
   * Verify the revealed keyword and next clue
   */
  async verifyRevealed(keyword: string, nextClue?: string) {
    await expect(this.modal).toContainText(keyword, { timeout: 5000 });
    if (nextClue) {
      await expect(this.modal).toContainText(nextClue, { timeout: 5000 });
    }
  }
}

/**
 * Clue solver for 3D box
 */
export class Box3DClue extends ClueBasePage {
  async solve() {
    const canvas = this.modal.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
    await this.wait(1500);

    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) {
      throw new Error('Canvas not found');
    }

    const centerX = canvasBox.x + canvasBox.width / 2;
    const centerY = canvasBox.y + canvasBox.height / 2;

    // Rotate right
    await this.page.mouse.move(centerX - 100, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(centerX + 100, centerY, { steps: 15 });
    await this.page.mouse.up();
    await this.wait(700);

    // Rotate left (1)
    await this.page.mouse.move(centerX + 100, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(centerX - 100, centerY, { steps: 15 });
    await this.page.mouse.up();
    await this.wait(700);

    // Rotate left (2)
    await this.page.mouse.move(centerX + 100, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(centerX - 100, centerY, { steps: 15 });
    await this.page.mouse.up();
    await this.wait(700);

    // Rotate right to return
    await this.page.mouse.move(centerX - 100, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(centerX + 100, centerY, { steps: 15 });
    await this.page.mouse.up();
    await this.wait(700);

    // Rotate upward to see the bottom
    await this.page.mouse.move(centerX, centerY + 100);
    await this.page.mouse.down();
    await this.page.mouse.move(centerX, centerY - 150, { steps: 20 });
    await this.page.mouse.up();
    await this.wait(1500);
  }
}

/**
 * Clue solver for page flip book
 */
export class PageFlipClue extends ClueBasePage {
  /**
   * Turn a page by swiping left (more natural for page flip on mobile)
   * Uses swipe gesture instead of click for better Safari compatibility
   */
  async turnPage() {
    await this.wait(1000); // Wait for page to be ready

    const pages = this.modal.locator('div[style*="background"]');
    const pageCount = await pages.count();

    if (pageCount > 0) {
      const rightPage = pages.last();
      const pageBox = await rightPage.boundingBox();

      if (pageBox) {
        // Calculate swipe coordinates (right to left swipe)
        const startX = pageBox.x + pageBox.width * 0.9; // Start at right edge
        const endX = pageBox.x + pageBox.width * 0.1;   // End at left edge
        const centerY = pageBox.y + pageBox.height / 2;

        try {
          // Strategy 1: Swipe gesture for mobile (most reliable for Safari)
          await this.page.mouse.move(startX, centerY);
          await this.page.mouse.down();
          await this.page.mouse.move(endX, centerY, { steps: 10 });
          await this.page.mouse.up();
          await this.wait(3500); // Extended wait for animation
          return;
        } catch {
          // Swipe failed, try other strategies
        }

        try {
          // Strategy 2: Touch swipe for Safari
          await this.page.touchscreen.tap(startX, centerY);
          await this.wait(500);
          await this.page.touchscreen.tap(pageBox.x + pageBox.width * 0.5, centerY);
          await this.wait(3500);
          return;
        } catch {
          // Touch tap failed
        }

        try {
          // Strategy 3: Multiple rapid taps on right side
          const clickX = pageBox.x + pageBox.width * 0.8;
          await this.page.mouse.click(clickX, centerY);
          await this.wait(200);
          await this.page.mouse.click(clickX, centerY);
          await this.wait(3500);
          return;
        } catch {
          // All strategies failed
        }
      }
    }

    // Fallback: just wait
    await this.wait(3500);
  }

  /**
   * Turn pages until the keyword button is visible
   */
  async turnUntilKeywordVisible(maxAttempts: number = 10) {
    const keywordButton = this.modal.getByTestId('keyword-button');

    for (let i = 0; i < maxAttempts; i++) {
      // Check if button is visible
      const isVisible = await keywordButton.isVisible().catch(() => false);
      if (isVisible) {
        // Double check it's really visible and ready
        await this.wait(1000);
        const stillVisible = await keywordButton.isVisible().catch(() => false);
        if (stillVisible) {
          return true;
        }
      }

      // Turn to next page
      await this.turnPage();

      // Extra wait on Mobile Safari
      await this.wait(500);
    }
    return false;
  }

  async solve() {
    await this.wait(2000);

    // Turn pages until we find the keyword button (it appears on page 3)
    const keywordButton = this.modal.getByTestId('keyword-button');

    // Try turning pages to find the keyword with extended attempts for mobile
    const maxAttempts = 10; // Increased for mobile reliability
    const found = await this.turnUntilKeywordVisible(maxAttempts);

    if (!found) {
      // If not found after all attempts, try one more time with longer waits
      await this.wait(2000);
      await this.turnPage();
      await this.wait(2000);
      await this.turnPage();
      await this.wait(2000);
    }

    // Wait for the button to be clickable with extended timeout
    await keywordButton.waitFor({ state: 'visible', timeout: 20000 });

    // Extra wait to ensure it's really ready
    await this.wait(1000);

    // Use JS click to bypass react-pageflip's touch/mouse interception.
    // On small screens (iPhone SE), coordinate-based tap/click can miss the
    // tiny <a> element and hit the parent div, which react-pageflip interprets
    // as a page flip gesture instead of forwarding the click.
    await keywordButton.evaluate((el: HTMLElement) => el.click());
    await this.wait(500);
  }

  /**
   * Verify content on a specific page
   */
  async verifyPageContent(text: string) {
    await expect(this.modal).toContainText(text, { timeout: 5000 });
  }

  /**
   * Complete solve with additional page turns to see all content
   */
  async solveComplete(additionalTurns: number = 2) {
    await this.solve();

    // Dismiss the "mot trouvé" overlay if it appeared
    await this.dismissMoment();

    // Continue turning pages
    for (let i = 0; i < additionalTurns; i++) {
      await this.turnPage();
    }
  }
}

/**
 * Clue solver for magnifier
 */
export class MagnifierClue extends ClueBasePage {
  async solve() {
    await this.wait(1500);

    const modalBody = this.modal.locator('.modal-body');
    const modalBox = await modalBody.boundingBox();

    if (!modalBox) {
      throw new Error('Modal body not found');
    }

    const centerX = modalBox.x + modalBox.width / 2;
    const centerY = modalBox.y + modalBox.height / 2;

    const margin = 100;
    const startX = modalBox.x + margin;
    const startY = modalBox.y + margin;
    const endX = modalBox.x + modalBox.width - margin;
    const endY = modalBox.y + modalBox.height - margin;

    const numRows = 5;
    const rowHeight = (endY - startY) / (numRows - 1);

    // Scan in zigzag pattern
    for (let row = 0; row < numRows; row++) {
      const y = startY + row * rowHeight;

      if (row % 2 === 0) {
        await this.page.mouse.move(startX, y, { steps: 10 });
        await this.wait(200);
        await this.page.mouse.move(endX, y, { steps: 20 });
        await this.wait(200);
      } else {
        await this.page.mouse.move(endX, y, { steps: 10 });
        await this.wait(200);
        await this.page.mouse.move(startX, y, { steps: 20 });
        await this.wait(200);
      }

      // Focus on center area
      if (row >= numRows / 2) {
        const radius = 40;
        for (let angle = 0; angle < 360; angle += 45) {
          const rad = (angle * Math.PI) / 180;
          const x = centerX + radius * Math.cos(rad);
          const y = centerY + radius * Math.sin(rad);
          await this.page.mouse.move(x, y, { steps: 5 });
          await this.wait(200);
        }

        await this.page.mouse.move(centerX, centerY, { steps: 5 });
        await this.wait(1500);
        break;
      }
    }
  }
}
