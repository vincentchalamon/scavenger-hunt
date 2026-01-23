import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

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
  async solveAndClose(expectedMessage?: string | RegExp) {
    await this.solve();

    // Verify and close toast
    try {
      await this.verifySuccessToast(expectedMessage);
      await this.closeToast();
    } catch (e) {
      // Toast handling skipped
    }

    // Close modal
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

    // Click the keyword button
    const keywordButton = this.modal.getByTestId('keyword-button');
    await keywordButton.waitFor({ state: 'visible', timeout: 5000 });
    await keywordButton.click();
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

    // Verification zone: {x: 0, y: height/3, width: 80%, height: height/4}
    const checkZoneX = canvasBox.x;
    const checkZoneY = canvasBox.y + canvasBox.height / 3;
    const checkZoneWidth = canvasBox.width * 0.8;
    const checkZoneHeight = canvasBox.height / 4;

    // Dense horizontal scratching
    const numHorizontalRows = 20;
    for (let row = 0; row < numHorizontalRows; row++) {
      const y = checkZoneY + (checkZoneHeight / numHorizontalRows) * row;
      await this.page.mouse.move(checkZoneX, y);
      await this.page.mouse.down();
      await this.page.mouse.move(checkZoneX + checkZoneWidth, y, { steps: 10 });
      await this.page.mouse.up();
      await this.wait(50);
    }

    // Dense vertical scratching
    const numVerticalCols = 15;
    for (let col = 0; col < numVerticalCols; col++) {
      const x = checkZoneX + (checkZoneWidth / numVerticalCols) * col;
      await this.page.mouse.move(x, checkZoneY);
      await this.page.mouse.down();
      await this.page.mouse.move(x, checkZoneY + checkZoneHeight, { steps: 8 });
      await this.page.mouse.up();
      await this.wait(50);
    }

    // Diagonal scratching
    await this.page.mouse.move(checkZoneX, checkZoneY);
    await this.page.mouse.down();
    await this.page.mouse.move(checkZoneX + checkZoneWidth, checkZoneY + checkZoneHeight, { steps: 15 });
    await this.page.mouse.up();

    await this.page.mouse.move(checkZoneX + checkZoneWidth, checkZoneY);
    await this.page.mouse.down();
    await this.page.mouse.move(checkZoneX, checkZoneY + checkZoneHeight, { steps: 15 });
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
        } catch (e) {
          // Swipe failed, try other strategies
        }

        try {
          // Strategy 2: Touch swipe for Safari
          await this.page.touchscreen.tap(startX, centerY);
          await this.wait(500);
          await this.page.touchscreen.tap(pageBox.x + pageBox.width * 0.5, centerY);
          await this.wait(3500);
          return;
        } catch (e) {
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
        } catch (e) {
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

    // Use tap on mobile devices for better compatibility
    try {
      const buttonBox = await keywordButton.boundingBox();
      if (buttonBox) {
        const centerX = buttonBox.x + buttonBox.width / 2;
        const centerY = buttonBox.y + buttonBox.height / 2;

        // Always try tap first on Safari
        try {
          await this.page.touchscreen.tap(centerX, centerY);
          await this.wait(500);
          return;
        } catch (tapError) {
          // Tap failed, try click
        }

        // Fallback to mouse click
        await this.page.mouse.click(centerX, centerY);
        await this.wait(500);
        return;
      }
    } catch (e) {
      // If getting bounding box fails, try direct click
      await keywordButton.click();
    }
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

    // Close toast if it appears
    try {
      await this.verifySuccessToast();
      await this.closeToast();
    } catch (e) {
      // Toast handling skipped
    }

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
