import {expect, Page} from '@playwright/test';
import {BasePage} from './BasePage';

/**
 * Page Object for the Map view
 */
export class MapPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the map tab button
   */
  get mapButton() {
    return this.page.getByTestId('map-button');
  }

  /**
   * Get the search field
   */
  get searchField() {
    return this.page.getByTestId('search-field');
  }

  /**
   * Get the search results container
   */
  get searchResults() {
    return this.page.getByTestId('search-results');
  }

  /**
   * Get all map markers (pins)
   */
  get markers() {
    return this.page.locator('.leaflet-marker-icon');
  }

  /**
   * Get the popup
   */
  get popup() {
    return this.page.locator('.leaflet-popup-content');
  }

  /**
   * Navigate to the map tab
   */
  async navigateToMap() {
    await this.mapButton.click();
    await this.wait(500);
  }

  /**
   * Verify the map tab is active
   */
  async verifyTabActive() {
    await expect(this.mapButton).toHaveClass(/active/, { timeout: 5000 });
    await expect(this.page.getByTestId('manuscript-button')).not.toHaveClass(/active/);
  }

  /**
   * Search for a place with retry mechanism for CORS/network errors
   *
   * This method implements an automatic retry mechanism to handle intermittent
   * CORS errors that can occur when Playwright tests query the Nominatim API.
   * These errors are typically caused by:
   * - Network timing issues in headless browser contexts
   * - Rate limiting from the Nominatim service
   * - CORS policy enforcement in test environments
   *
   * The retry mechanism:
   * - Monitors network requests to nominatim.openstreetmap.org
   * - Retries up to maxRetries times with exponential backoff
   * - Logs retry attempts for debugging purposes
   * - Proceeds even on the last attempt to avoid blocking tests
   *
   * @param query - The search query string
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   */
  async searchPlace(query: string, maxRetries: number = 3) {
    await this.searchField.waitFor({ state: 'visible', timeout: 5000 });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Track network requests to Nominatim
        let requestFailed = false;
        let requestSucceeded = false;

        const requestFailedHandler = (request: any) => {
          if (request.url().includes('nominatim.openstreetmap.org')) {
            console.log(`Nominatim request failed on attempt ${attempt} for "${query}"`);
            requestFailed = true;
          }
        };

        const responseHandler = (response: any) => {
          if (response.url().includes('nominatim.openstreetmap.org') && response.ok()) {
            requestSucceeded = true;
          }
        };

        this.page.on('requestfailed', requestFailedHandler);
        this.page.on('response', responseHandler);

        await this.searchField.clear();
        await this.searchField.fill(query);

        // Wait for the search to complete
        await this.wait(2500);

        // Clean up listeners
        this.page.off('requestfailed', requestFailedHandler);
        this.page.off('response', responseHandler);

        // Check if results are visible
        const resultsVisible = await this.searchResults.isVisible().catch(() => false);

        if (resultsVisible || requestSucceeded) {
          // Success - results are available
          await this.wait(500);
          return;
        }

        // If the request failed and it's not the last attempt, retry
        if (requestFailed && attempt < maxRetries) {
          console.log(`Retrying search for "${query}" (attempt ${attempt + 1}/${maxRetries})...`);
          await this.wait(1000 * attempt); // Exponential backoff
          continue;
        }

        // Last attempt or no explicit failure - proceed anyway
        await this.wait(500);
        return;

      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        console.log(`Search attempt ${attempt} encountered error for "${query}":`, error);
        await this.wait(1000 * attempt); // Exponential backoff
      }
    }
  }

  /**
   * Select a search result by index (0-based) with retry mechanism
   *
   * This method retries the selection if the search results are not yet available,
   * which can happen when the Nominatim API response is delayed or has failed.
   *
   * @param index - The index of the result to select (0-based, default: 0)
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   */
  async selectSearchResult(index: number = 0, maxRetries: number = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const results = this.searchResults.getByRole('button');
        const result = index === 0 ? results.first() : results.nth(index);
        await result.waitFor({ state: 'visible', timeout: 10000 });
        await result.click();
        await this.wait(1500);
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        console.log(`Select result attempt ${attempt} failed, retrying...`);
        await this.wait(1000 * attempt);
      }
    }
  }

  /**
   * Verify the number of markers on the map
   */
  async verifyMarkerCount(count: number) {
    await expect(this.markers).toHaveCount(count, { timeout: 15000 });
  }

  /**
   * Verify the popup shows a specific place name
   */
  async verifyPopupPlace(placeName: string) {
    await expect(this.popup.locator('h5')).toContainText(placeName, { timeout: 10000 });
  }

  /**
   * Click the button in the popup to show the clue
   */
  async showClue() {
    const showButton = this.popup.locator('.container button');
    await showButton.waitFor({ state: 'visible', timeout: 5000 });
    // Use JavaScript to trigger click on parent div (has the onClick handler)
    await showButton.evaluate((btn) => {
      const parentDiv = btn.parentElement;
      if (parentDiv) {
        parentDiv.click();
      }
    });
    await this.waitForModalReady();
  }

  /**
   * Verify the popup contains specific text
   */
  async verifyPopupText(text: string) {
    await expect(this.popup).toContainText(text, { timeout: 5000 });
  }

  /**
   * Verify the popup has no button (final place)
   */
  async verifyNoButton() {
    await expect(this.popup.locator('.container button')).not.toBeVisible();
  }

  /**
   * Complete flow: search place, select result, verify marker
   */
  async findPlace(query: string, placeName: string, expectedMarkerCount: number, resultIndex: number = 0) {
    await this.searchPlace(query);
    await this.selectSearchResult(resultIndex);
    await this.verifyMarkerCount(expectedMarkerCount);
    await this.verifyPopupPlace(placeName);
  }
}
