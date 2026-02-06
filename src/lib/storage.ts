/**
 * Utility functions to manage hunt progress in localStorage
 * Each hunt has its own storage keys based on huntSlug
 */

/**
 * Get the keywords for a specific hunt
 */
export const getKeywords = (huntSlug: string, defaultKeywords: string[] = []): string[] => {
  if (typeof localStorage === "undefined") {
    return defaultKeywords;
  }

  const storageKey = `keywords_${huntSlug}`;
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : defaultKeywords;
};

/**
 * Save keywords for a specific hunt
 */
export const saveKeywords = (huntSlug: string, keywords: string[]): void => {
  if (typeof localStorage === "undefined") {
    return;
  }

  const storageKey = `keywords_${huntSlug}`;
  localStorage.setItem(storageKey, JSON.stringify(keywords));
};

/**
 * Get visited places for a specific hunt
 */
export const getVisitedPlaces = <T>(huntSlug: string, defaultPlaces: T[] = []): T[] => {
  if (typeof localStorage === "undefined") {
    return defaultPlaces;
  }

  const storageKey = `places_${huntSlug}`;
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : defaultPlaces;
};

/**
 * Save visited places for a specific hunt
 */
export const saveVisitedPlaces = <T>(huntSlug: string, places: T[]): void => {
  if (typeof localStorage === "undefined") {
    return;
  }

  const storageKey = `places_${huntSlug}`;
  localStorage.setItem(storageKey, JSON.stringify(places));
};

/**
 * Clear all progress for a specific hunt
 */
export const clearHuntProgress = (huntSlug: string): void => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(`keywords_${huntSlug}`);
  localStorage.removeItem(`places_${huntSlug}`);
};

/**
 * Clear all progress for all hunts
 */
export const clearAllProgress = (): void => {
  if (typeof localStorage === "undefined") {
    return;
  }

  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('keywords_') || key.startsWith('places_')) {
      localStorage.removeItem(key);
    }
  });
};

