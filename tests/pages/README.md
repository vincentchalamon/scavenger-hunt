# Page Object Model pour Lille Hunting

Ce dossier contient l'implémentation du Page Object Model (POM) pour les tests Playwright de l'application Lille Hunting.

## Architecture

L'architecture est conçue pour être réutilisable avec différents jeux de chasse au trésor, langues, et types d'énigmes.

### Structure des fichiers

```
tests/pages/
├── index.ts              # Point d'entrée, exporte tous les objets
├── BasePage.ts           # Classe de base avec fonctionnalités communes
├── SecurityPage.ts       # Gestion de la page de sécurité / clé API
├── ManuscriptPage.ts     # Gestion de l'onglet manuscrit
├── MapPage.ts            # Gestion de l'onglet carte et Google Maps
├── CluePage.ts           # Résolveurs pour tous les types d'énigmes
└── HuntApp.ts            # Orchestrateur principal de l'application
```

## Utilisation

### Initialisation basique

```typescript
import { test } from '@playwright/test';
import { HuntApp } from './pages';

test('My hunt test', async ({ page }) => {
  const app = new HuntApp(page);
  
  // Initialiser avec la clé API
  await app.initialize(process.env.GOOGLE_MAPS_API_KEY as string);
  
  // Vérifier le titre
  await app.verifyHuntTitle('Le Trésor du Vieux-Lille');
});
```

### Résolution d'énigmes

#### Image cliquable (Clickable Image)

```typescript
await app.solveClickableImagePlace(
  'Hospice',                          // Requête de recherche
  'Musée de l\'Hospice Comtesse',    // Nom du lieu attendu
  2,                                   // Nombre de marqueurs attendus
  'Le trésor du ...',                 // Phrase attendue après résolution
  0                                    // Index du résultat (optionnel, défaut: 0)
);
```

#### Carte à gratter (Scratch Card)

```typescript
await app.solveScratchCardPlace(
  'Merveilleux',                      // Requête de recherche
  'Aux Merveilleux de Fred',          // Nom du lieu
  3,                                   // Nombre de marqueurs
  'Colonne',                          // Mot-clé révélé attendu
  'Le trésor du ... Colonne ...',     // Phrase attendue
  'Place aux Oignons',                // Indice suivant (optionnel)
  1                                    // Index du résultat (optionnel)
);
```

#### Boîte 3D (3D Box)

```typescript
await app.solveBox3DPlace(
  'Méert',                            // Requête de recherche
  'Maison Méert',                     // Nom du lieu
  6,                                   // Nombre de marqueurs
  'Le trésor du ... de ...'           // Phrase attendue
);
```

#### Livre à tourner (Page Flip)

```typescript
await app.solvePageFlipPlace(
  'Vieille Bourse',                   // Requête de recherche
  'Vieille Bourse',                   // Nom du lieu
  7,                                   // Nombre de marqueurs
  'Le trésor du Vieux-Lille ...',     // Phrase attendue
  'Allez à l\'Opéra !'                // Texte de la dernière page
);
```

#### Loupe (Magnifier)

```typescript
await app.solveMagnifierPlace(
  'Opéra Lille',                      // Requête de recherche
  'Opéra de Lille',                   // Nom du lieu
  8,                                   // Nombre de marqueurs
  'Le trésor du Vieux-Lille se trouve...', // Phrase attendue
  'Félicitations ! ...'               // Message de succès (optionnel)
);
```

### Utilisation directe des résolveurs d'énigmes

Pour plus de contrôle, vous pouvez utiliser directement les résolveurs :

```typescript
// Après avoir ouvert une modal d'énigme
const clue = app.createClickableImageClue();
await clue.solve();                  // Résoudre l'énigme
await clue.verifySuccessToast();     // Vérifier le toast
await clue.closeToast();             // Fermer le toast
await clue.closeModal();             // Fermer la modal

// Ou utiliser la méthode combinée
await clue.solveAndClose('Message de succès attendu');
```

### Accès aux pages individuelles

Vous pouvez accéder directement aux pages pour des opérations spécifiques :

```typescript
// Page de sécurité
await app.security.enterApiKey('YOUR_API_KEY');
await app.security.verifyAuthenticated();

// Page manuscrit
await app.manuscript.navigateToManuscript();
await app.manuscript.verifyText('phrase complète');
await app.manuscript.verifyPhraseComplete();
await app.manuscript.verifyClues('mot1', 'mot2');

// Page carte
await app.map.navigateToMap();
await app.map.searchPlace('Notre-Dame');
await app.map.selectSearchResult(0);
await app.map.verifyMarkerCount(5);
await app.map.verifyInfoWindowPlace('Cathédrale');
await app.map.showClue();
```

## Créer un nouveau jeu

Pour créer des tests pour un nouveau jeu de chasse au trésor :

1. **Créer un nouveau fichier de test** :

```typescript
import { test } from '@playwright/test';
import { HuntApp } from './pages';

test.describe('Mon Nouveau Jeu', () => {
  test('Complete journey', async ({ page }) => {
    const app = new HuntApp(page);
    
    await app.initialize(process.env.GOOGLE_MAPS_API_KEY);
    await app.verifyHuntTitle('Mon Nouveau Jeu');
    
    // Utiliser les méthodes réutilisables
    await app.solveClickableImagePlace(...);
    // etc.
  });
});
```

2. **Personnaliser si nécessaire** :

Si vous avez besoin de nouveaux types d'énigmes, ajoutez-les dans `CluePage.ts` :

```typescript
export class MonNouveauTypeClue extends ClueBasePage {
  async solve() {
    // Logique de résolution
  }
}
```

Puis ajoutez une méthode factory dans `HuntApp.ts` :

```typescript
createMonNouveauTypeClue() {
  return new MonNouveauTypeClue(this.page);
}
```

## Internationalisation

Pour créer une version en anglais :

1. Créer un nouveau fichier `HuntAppEN.ts` qui étend `HuntApp`
2. Surcharger les messages et textes :

```typescript
export class HuntAppEN extends HuntApp {
  async verifySuccessMessage() {
    await this.security.verifySuccessToast('Success! You found a keyword...');
  }
}
```

## Avantages de cette architecture

- ✅ **Réutilisable** : Même code pour différents jeux
- ✅ **Maintenable** : Changements localisés dans les pages
- ✅ **Testable** : Chaque page peut être testée indépendamment
- ✅ **Lisible** : Tests expressifs et faciles à comprendre
- ✅ **Flexible** : Facile d'ajouter de nouveaux types d'énigmes
- ✅ **Modulaire** : Composition de comportements complexes

## Helpers disponibles

### BasePage

- `goto()` - Naviguer vers l'application
- `wait(ms)` - Attendre une durée
- `closeAllModals()` - Fermer toutes les modals
- `waitForModalReady()` - Attendre qu'une modal soit prête
- `closeToast()` - Fermer un toast
- `verifySuccessToast(message?)` - Vérifier un toast de succès
- `closeModal()` - Fermer la modal courante

### MapPage

- `waitForMapReady()` - Attendre que Google Maps soit chargé
- `searchPlace(query)` - Rechercher un lieu
- `selectSearchResult(index)` - Sélectionner un résultat
- `verifyMarkerCount(count)` - Vérifier le nombre de marqueurs
- `verifyInfoWindowPlace(name)` - Vérifier le nom du lieu affiché
- `showClue()` - Afficher l'énigme
- `findPlace(query, name, markerCount, resultIndex)` - Flux complet de recherche

### ManuscriptPage

- `navigateToManuscript()` - Aller sur l'onglet manuscrit
- `verifyText(text)` - Vérifier la présence d'un texte
- `verifyTabActive()` - Vérifier que l'onglet est actif
- `getText()` - Récupérer le texte du manuscrit
- `verifyPhraseComplete()` - Vérifier qu'il n'y a plus de points de suspension
- `verifyClues(...clues)` - Vérifier la présence de plusieurs indices

## Tests en CI

Les tests sont conçus pour être stables en CI avec :

- Timeouts généreux (180s par test)
- Attentes robustes avec retry automatique
- Gestion des animations et transitions
- Fallbacks pour les éléments qui peuvent disparaître
- Logs pour le debugging

## Contribution

Pour ajouter de nouvelles fonctionnalités :

1. Ajouter la méthode dans la page appropriée
2. Documenter avec JSDoc
3. Mettre à jour ce README
4. Ajouter des tests si nécessaire
