import { useState, useEffect } from 'react';

/**
 * Hook pour gérer la progression d'une chasse au trésor
 * Stocke les lieux visités et les mots-clés trouvés dans localStorage
 */
export const useHuntProgress = (huntSlug: string, totalPlaces: number, totalKeywords: number) => {
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);
  const [foundKeywords, setFoundKeywords] = useState<string[]>([]);

  // Charger la progression depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storageKey = `hunt_progress_${huntSlug}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        setVisitedPlaces(data.visitedPlaces || []);
        setFoundKeywords(data.foundKeywords || []);
      } catch (e) {
        console.error('Error loading hunt progress:', e);
      }
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

