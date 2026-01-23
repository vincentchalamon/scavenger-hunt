import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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
    return this.page.locator('.GMAMP-maps-pin-view');
  }

  /**
   * Get the info window (popup on map)
   */
  get infoWindow() {
    return this.page.locator('.gm-style-iw-c');
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
   * Wait for Google Maps to be fully loaded
   */
  async waitForMapReady() {
    await this.wait(3000);
    try {
      await this.page.waitForFunction(() => {
        const hasMapContainer = document.querySelector('[data-testid="map"]') !== null;
        const hasGoogleMap = document.querySelector('.gm-style') !== null;
        return hasMapContainer && (hasGoogleMap || document.querySelectorAll('.GMAMP-maps-pin-view').length > 0);
      }, { timeout: 25000 });
    } catch (e) {
      // Map ready timeout, continuing anyway
    }
  }

  /**
   * Search for a place
   */
  async searchPlace(query: string) {
    await this.searchField.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchField.clear();
    await this.searchField.fill(query);
    await this.wait(2000);
  }

  /**
   * Select a search result by index (0-based)
   */
  async selectSearchResult(index: number = 0) {
    const results = this.searchResults.getByRole('button');
    const result = index === 0 ? results.first() : results.nth(index);
    await result.waitFor({ state: 'visible', timeout: 10000 });
    await result.click();
    await this.wait(1500);
  }

  /**
   * Verify the number of markers on the map
   */
  async verifyMarkerCount(count: number) {
    await expect(this.markers).toHaveCount(count, { timeout: 15000 });
  }

  /**
   * Verify the info window shows a specific place name
   */
  async verifyInfoWindowPlace(placeName: string) {
    await expect(this.infoWindow.locator('h5')).toContainText(placeName, { timeout: 10000 });
  }

  /**
   * Click the button in the info window to show the clue
   */
  async showClue() {
    const showButton = this.infoWindow.locator('.container button');
    await showButton.waitFor({ state: 'visible', timeout: 5000 });
    await showButton.click();
    await this.waitForModalReady();
  }

  /**
   * Verify the info window contains specific text
   */
  async verifyInfoWindowText(text: string) {
    await expect(this.infoWindow).toContainText(text, { timeout: 5000 });
  }

  /**
   * Verify the info window has no button (final place)
   */
  async verifyNoButton() {
    await expect(this.infoWindow.locator('.container button')).not.toBeVisible();
  }

  /**
   * Complete flow: search place, select result, verify marker
   */
  async findPlace(query: string, placeName: string, expectedMarkerCount: number, resultIndex: number = 0) {
    await this.searchPlace(query);
    await this.selectSearchResult(resultIndex);
    await this.verifyMarkerCount(expectedMarkerCount);
    await this.verifyInfoWindowPlace(placeName);
  }
}
