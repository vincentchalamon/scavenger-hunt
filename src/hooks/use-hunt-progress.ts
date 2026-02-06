import { useState, useEffect } from 'react';

/**
 * Hook pour gérer la progression d'une chasse au trésor
 * Lit les lieux visités et les mots-clés trouvés depuis localStorage
 */
export const useHuntProgress = (huntSlug: string, totalPlaces: number, totalKeywords: number) => {
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);
  const [foundKeywords, setFoundKeywords] = useState<string[]>([]);

  // Charger la progression depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const placesKey = `places_${huntSlug}`;
    const keywordsKey = `keywords_${huntSlug}`;

    const placesStored = localStorage.getItem(placesKey);
    const keywordsStored = localStorage.getItem(keywordsKey);

    try {
      if (placesStored) {
        setVisitedPlaces(JSON.parse(placesStored));
      }
      if (keywordsStored) {
        setFoundKeywords(JSON.parse(keywordsStored));
      }
    } catch (e) {
      console.error('Error loading hunt progress:', e);
    }
  }, [huntSlug]);

  // Calculer le pourcentage de progression
  const progress = Math.round(
    ((visitedPlaces.length / totalPlaces) * 50 +
     (foundKeywords.length / totalKeywords) * 50)
  );

  return {
    visitedPlaces,
    foundKeywords,
    progress: isNaN(progress) ? 0 : Math.min(100, progress),
  };
};

