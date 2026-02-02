/**
 * Page Objects and helpers for Lille Hunting tests
 *
 * This module provides a Page Object Model (POM) implementation
 * that can be reused across different hunts, languages, and puzzle types.
 */

export { BasePage } from './BasePage';
export { ManuscriptPage } from './ManuscriptPage';
export { MapPage } from './MapPage';
export {
  ClueBasePage,
  ClickableImageClue,
  ScratchCardClue,
  Box3DClue,
  PageFlipClue,
  MagnifierClue
} from './CluePage';
export { HuntApp } from './HuntApp';
