import { Page, expect } from '@playwright/test';
import { SecurityPage } from './SecurityPage';
import { ManuscriptPage } from './ManuscriptPage';
import { MapPage } from './MapPage';
import {
  ClickableImageClue,
  ScratchCardClue,
  Box3DClue,
  PageFlipClue,
  MagnifierClue
} from './CluePage';

/**
 * Main Application Page Object
 * Aggregates all page objects and provides high-level workflows
 */
export class HuntApp {
  readonly page: Page;
  readonly security: SecurityPage;
  readonly manuscript: ManuscriptPage;
  readonly map: MapPage;
  readonly slug: string;

  constructor(page: Page, slug: string = 'le-tresor-du-vieux-lille') {
    this.page = page;
    this.slug = slug;
    this.security = new SecurityPage(page, slug);
    this.manuscript = new ManuscriptPage(page);
    this.map = new MapPage(page);
  }

  /**
   * Get the hunt title element
   */
  get huntTitle() {
    return this.page.getByTestId('hunt-title');
  }

  /**
   * Initialize the application and login with API key
   */
  async initialize(apiKey: string) {
    await this.security.goto();
    await this.security.enterApiKey(apiKey);
    await expect(this.huntTitle).toBeVisible({ timeout: 20000 });
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify the hunt title contains specific text
   */
  async verifyHuntTitle(title: string) {
    await expect(this.huntTitle).toContainText(title, { timeout: 5000 });
  }

  /**
   * Create a clue solver for clickable image
   */
  createClickableImageClue() {
    return new ClickableImageClue(this.page);
  }

  /**
   * Create a clue solver for scratch card
   */
  createScratchCardClue() {
    return new ScratchCardClue(this.page);
  }

  /**
   * Create a clue solver for 3D box
   */
  createBox3DClue() {
    return new Box3DClue(this.page);
  }

  /**
   * Create a clue solver for page flip
   */
  createPageFlipClue() {
    return new PageFlipClue(this.page);
  }

  /**
   * Create a clue solver for magnifier
   */
  createMagnifierClue() {
    return new MagnifierClue(this.page);
  }

  /**
   * Solve a place with clickable image clue
   */
  async solveClickableImagePlace(
    searchQuery: string,
    placeName: string,
    markerCount: number,
    expectedPhrase: string,
    resultIndex: number = 0,
    successMessage?: string
  ) {
    await this.map.closeAllModals();
    await this.map.findPlace(searchQuery, placeName, markerCount, resultIndex);
    await this.map.showClue();

    const clue = this.createClickableImageClue();
    await clue.solveAndClose(successMessage);

    await this.manuscript.navigateToManuscript();
    await this.manuscript.verifyText(expectedPhrase);
    await this.map.navigateToMap();
  }

  /**
   * Solve a place with scratch card clue
   */
  async solveScratchCardPlace(
    searchQuery: string,
    placeName: string,
    markerCount: number,
    keyword: string,
    expectedPhrase: string,
    nextClue?: string,
    resultIndex: number = 0
  ) {
    await this.map.closeAllModals();
    await this.map.findPlace(searchQuery, placeName, markerCount, resultIndex);
    await this.map.showClue();

    const clue = this.createScratchCardClue();
    await clue.solve();
    await clue.verifyRevealed(keyword, nextClue);

    try {
      await this.map.closeToast();
    } catch (e) {
      // Toast handling skipped
    }

    await clue.closeModal();

    await this.manuscript.navigateToManuscript();
    await this.manuscript.verifyText(expectedPhrase);
    await this.map.navigateToMap();
  }

  /**
   * Solve a place with 3D box clue
   */
  async solveBox3DPlace(
    searchQuery: string,
    placeName: string,
    markerCount: number,
    expectedPhrase: string,
    resultIndex: number = 0
  ) {
    await this.map.closeAllModals();
    await this.map.findPlace(searchQuery, placeName, markerCount, resultIndex);
    await this.map.showClue();

    const clue = this.createBox3DClue();
    await clue.solveAndClose();

    await this.manuscript.navigateToManuscript();
    await this.manuscript.verifyText(expectedPhrase);
    await this.map.navigateToMap();
  }

  /**
   * Solve a place with page flip clue
   */
  async solvePageFlipPlace(
    searchQuery: string,
    placeName: string,
    markerCount: number,
    expectedPhrase: string,
    lastPageText: string,
    resultIndex: number = 0
  ) {
    await this.map.closeAllModals();
    await this.map.findPlace(searchQuery, placeName, markerCount, resultIndex);
    await this.map.showClue();

    const clue = this.createPageFlipClue();
    await clue.solveComplete(2);
    await clue.verifyPageContent(lastPageText);
    await clue.closeModal();

    await this.manuscript.navigateToManuscript();
    await this.manuscript.verifyText(expectedPhrase);
    await this.map.navigateToMap();
  }

  /**
   * Solve a place with magnifier clue
   */
  async solveMagnifierPlace(
    searchQuery: string,
    placeName: string,
    markerCount: number,
    expectedPhrase: string,
    completionMessage?: string,
    resultIndex: number = 0
  ) {
    await this.map.closeAllModals();
    await this.map.findPlace(searchQuery, placeName, markerCount, resultIndex);
    await this.map.showClue();

    const clue = this.createMagnifierClue();
    await clue.solveAndClose(completionMessage);

    await this.manuscript.navigateToManuscript();
    await this.manuscript.verifyText(expectedPhrase);
    await this.map.navigateToMap();
  }

  /**
   * Verify and visit the final treasure location
   */
  async verifyTreasureLocation(
    searchQuery: string,
    placeName: string,
    markerCount: number,
    congratsText: string,
    treasureText: string,
    resultIndex: number = 0
  ) {
    await this.map.navigateToMap();
    await this.map.searchPlace(searchQuery);
    await this.map.selectSearchResult(resultIndex);
    await this.map.verifyMarkerCount(markerCount);
    await this.map.verifyInfoWindowPlace(placeName);
    await this.map.verifyInfoWindowText(congratsText);
    await this.map.verifyInfoWindowText(treasureText);
    await this.map.verifyNoButton();
  }

  /**
   * Reload and verify data persistence
   */
  async verifyPersistence(expectedMarkerCount: number, completedPhrase: string) {
    await this.page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    await this.security.verifyAuthenticated();
    await expect(this.huntTitle).toBeVisible({ timeout: 10000 });

    await this.manuscript.navigateToManuscript();
    await this.manuscript.verifyText(completedPhrase);

    await this.map.navigateToMap();
    await this.map.verifyTabActive();
    await this.page.waitForTimeout(2000);
    await this.map.waitForMapReady();
    await this.map.verifyMarkerCount(expectedMarkerCount);
  }
}
