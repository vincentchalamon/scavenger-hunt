#!/usr/bin/env node

/**
 * Script de génération du cache statique des lieux
 *
 * Ce script lit le fichier config.json et génère automatiquement
 * le fichier places-cache.ts avec tous les lieux de toutes les chasses.
 *
 * Exécution : node scripts/generate-places-cache.js
 */

const fs = require('fs');
const path = require('path');

// Chemins
const CONFIG_PATH = path.join(__dirname, '../config.json');
const OUTPUT_PATH = path.join(__dirname, '../src/lib/places-cache.generated.ts');

/**
 * Normalise une chaîne de recherche
 */
function normalizeSearchQuery(query) {
  return query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .trim();
}

/**
 * Génère les variations de recherche pour un nom de lieu
 */
function generateSearchVariations(name) {
  const normalized = normalizeSearchQuery(name);
  const variations = new Set([normalized]);

  // Variations basées sur les mots
  const words = normalized.split(/\s+/);

  // Premier mot
  if (words.length > 0) {
    variations.add(words[0]);
  }

  // Premiers mots progressifs (ex: "notre", "notre dame", "notre dame de la treille")
  for (let i = 1; i < words.length; i++) {
    variations.add(words.slice(0, i + 1).join(' '));
  }

  // Mots clés importants (dernier mot, mots > 3 lettres)
  words.forEach(word => {
    if (word.length > 3) {
      variations.add(word);
    }
  });

  return Array.from(variations);
}

/**
 * Génère un placeId factice mais unique basé sur le nom et les coordonnées
 */
function generatePlaceId(name, coordinates) {
  // Format similaire à Google : ChIJ + hash unique
  const hash = Buffer.from(`${name}-${coordinates.lat}-${coordinates.lng}`)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 20);
  return `ChIJ${hash}`;
}

/**
 * Génère le code TypeScript pour le cache
 */
function generateCacheFile(config) {
  const cache = {};

  // Parcourir toutes les chasses
  config.hunts.forEach(hunt => {
    console.log(`Processing hunt: ${hunt.name} (${hunt.places.length} places)`);

    // Parcourir tous les lieux de cette chasse
    hunt.places.forEach(place => {
      const placeId = generatePlaceId(place.name, place.coordinates);
      const placeData = {
        placeId,
        displayName: place.name,
        formattedAddress: `${place.coordinates.lat.toFixed(4)}, ${place.coordinates.lng.toFixed(4)}`, // Coordonnées comme adresse de secours
        location: {
          lat: place.coordinates.lat,
          lng: place.coordinates.lng
        }
      };

      // Générer les variations de recherche
      const variations = generateSearchVariations(place.name);

      variations.forEach(variation => {
        if (!cache[variation]) {
          cache[variation] = [];
        }

        // Éviter les doublons (même placeId)
        const exists = cache[variation].some(p => p.placeId === placeId);
        if (!exists) {
          cache[variation].push(placeData);
        }
      });

      console.log(`  - ${place.name}: ${variations.length} variations`);
    });
  });

  // Générer le code TypeScript
  const code = `/**
 * FICHIER GÉNÉRÉ AUTOMATIQUEMENT - NE PAS MODIFIER
 *
 * Ce fichier est généré au moment du build par le script:
 * scripts/generate-places-cache.js
 *
 * Il contient tous les lieux de toutes les chasses au trésor
 * pré-cachés pour éviter les appels API Google Maps.
 *
 * Pour régénérer : npm run generate-cache
 */

export type CachedPlaceResult = {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type PlacesCache = {
  [searchQuery: string]: CachedPlaceResult[];
};

/**
 * Cache statique des lieux
 * Généré automatiquement depuis config.json
 */
export const PLACES_CACHE: PlacesCache = ${JSON.stringify(cache, null, 2)};

/**
 * Normalise une chaîne de recherche pour la comparaison avec le cache
 * - Conversion en minuscules
 * - Suppression des accents
 * - Trim des espaces
 */
export const normalizeSearchQuery = (query: string): string => {
  return query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .trim();
};

/**
 * Recherche dans le cache statique
 * Retourne les résultats si trouvés, sinon null
 */
export const searchInCache = (query: string): CachedPlaceResult[] | null => {
  const normalizedQuery = normalizeSearchQuery(query);

  if (PLACES_CACHE[normalizedQuery]) {
    return PLACES_CACHE[normalizedQuery];
  }

  return null;
};
`;

  return { code, cache };
}

/**
 * Main
 */
function main() {
  console.log('🚀 Génération du cache des lieux...\n');

  // Lire le fichier config.json
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`❌ Erreur: ${CONFIG_PATH} n'existe pas`);
    process.exit(1);
  }

  const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
  const config = JSON.parse(configContent);

  console.log(`📖 Configuration chargée: ${config.hunts.length} chasse(s)\n`);

  // Générer le code
  const { code, cache } = generateCacheFile(config);

  // Écrire le fichier
  fs.writeFileSync(OUTPUT_PATH, code, 'utf8');

  console.log(`\n✅ Cache généré avec succès: ${OUTPUT_PATH}`);

  // Statistiques
  const totalVariations = Object.keys(cache).length;
  const totalPlaces = new Set(
    Object.values(cache)
      .flat()
      .map(p => p.placeId)
  ).size;

  console.log(`\n📊 Statistiques:`);
  console.log(`   - Lieux uniques: ${totalPlaces}`);
  console.log(`   - Variations de recherche: ${totalVariations}`);
  console.log(`   - Taille du fichier: ${(code.length / 1024).toFixed(2)} KB\n`);
}

// Exécution
main();
