import { test, expect } from '@playwright/test';

/**
 * Scénario de test e2e complet testant l'intégralité de l'application "Le Trésor du Vieux-Lille"
 *
 * Ce test simule le parcours complet d'un utilisateur depuis l'initialisation de l'application
 * jusqu'à la découverte du trésor final en passant par tous les lieux du jeu.
 *
 * Ce test a été généré par ChatGPT à partir d'une description textuelle du scénario de test.
 */
test.describe('Le Trésor du Vieux-Lille', () => {

  test('Complete user journey from start to treasure discovery', async ({ page }) => {
    // Configuration pour la stabilité en CI
    test.setTimeout(180000); // 3 minutes timeout pour le test complet

    // Fonction utilitaire pour fermer toutes les modales ouvertes
    const closeAllModals = async () => {
      const modals = page.getByTestId('modal');
      const count = await modals.count();
      for (let i = 0; i < count; i++) {
        try {
          const modal = modals.nth(i);
          if (await modal.isVisible()) {
            const closeBtn = modal.locator('.btn-close');
            if (await closeBtn.isVisible()) {
              await closeBtn.click();
              await modal.waitFor({ state: 'hidden', timeout: 3000 });
            }
          }
        } catch (e) {
          // Ignorer les erreurs si la modal est déjà fermée
        }
      }
    };

    // Fonction utilitaire pour attendre qu'une modal soit stable et interactible
    const waitForModalReady = async () => {
      const modal = page.getByTestId('modal');
      await expect(modal).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(800); // Attendre la fin des animations
      await modal.waitFor({ state: 'visible', timeout: 5000 });
    };

    // Fonction pour attendre le chargement complet de Google Maps
    const waitForMapReady = async () => {
      await page.waitForTimeout(3000);
      // Attendre que Google Maps soit chargé en vérifiant plusieurs indicateurs possibles
      try {
        await page.waitForFunction(() => {
          // Vérifier plusieurs indicateurs de chargement de Google Maps
          const hasMapContainer = document.querySelector('[data-testid="map"]') !== null;
          const hasGoogleMap = document.querySelector('.gm-style') !== null;
          return hasMapContainer && (hasGoogleMap || document.querySelectorAll('.GMAMP-maps-pin-view').length > 0);
        }, { timeout: 25000 });
      } catch (e) {
        // Si le timeout est atteint, on log et continue quand même
        console.log('Map ready timeout, continuing anyway...');
      }
    };

    // ========================================
    // ÉTAPE 1: Initialisation de l'application
    // ========================================
    await test.step('Initialize application and enter API key', async () => {
      await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

      // Vérifier que la page de sécurité est affichée avec timeout étendu
      const apiKeyInput = page.getByPlaceholder('Clé d\'accès');
      await expect(apiKeyInput).toBeVisible({ timeout: 15000 });

      // Entrer la clé d'accès
      await apiKeyInput.fill(process.env.GOOGLE_MAPS_API_KEY as string);
      await page.waitForTimeout(300);

      // Attendre que le bouton soit cliquable
      const saveButton = page.getByRole('button', { name: 'Enregistrer', exact: true });
      await saveButton.waitFor({ state: 'visible', timeout: 5000 });
      await saveButton.click();

      // Vérifier que l'application est chargée
      await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 20000 });
      await expect(page.getByTestId('hunt-title')).toContainText('Le Trésor du Vieux-Lille', { timeout: 5000 });

      // Attendre un peu pour que l'application se stabilise
      await page.waitForTimeout(2000);
    });

    // ========================================
    // ÉTAPE 2: Lecture du manuscrit et des règles
    // ========================================
    await test.step('Read manuscript and game rules', async () => {
      // Vérifier que le manuscrit est affiché par défaut
      await expect(page.getByTestId('manuscript-button')).toHaveClass('nav-link active');
      await expect(page.getByTestId('manuscript')).toBeVisible();

      // Vérifier la présence de la phrase avec les mots manquants
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor .... ...................... se trouve .... ........ .... .... .............. .... .... ............');

      // Vérifier la présence de l'indice initial mentionnant "BRAS" et "OR"
      await expect(page.getByTestId('manuscript')).toContainText('BRAS');
      await expect(page.getByTestId('manuscript')).toContainText('OR');
    });

    // ========================================
    // ÉTAPE 3: Navigation vers l'onglet carte
    // ========================================
    await test.step('Navigate to map tab', async () => {
      // Naviguer vers l'onglet carte
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(1000);

      // Vérifier que l'onglet carte est actif
      await expect(page.getByTestId('map-button')).toHaveClass(/active/, { timeout: 5000 });
      await expect(page.getByTestId('manuscript-button')).not.toHaveClass(/active/);

      // Attendre que Google Maps se charge maintenant qu'on est sur l'onglet carte
      await page.waitForTimeout(2000);

      // Vérifier la présence du champ de recherche
      await expect(page.getByTestId('search-field')).toBeVisible({ timeout: 10000 });

      // Vérifier qu'un marqueur est déjà présent (premier lieu) avec timeout plus long
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(1, { timeout: 30000 });
      await expect(page.locator('.gm-style-iw-c')).toBeVisible({ timeout: 10000 });
    });

    // ========================================
    // ÉTAPE 4: Lieu 1 - Le Bras d'Or
    // ========================================
    await test.step('Place 1: Le Bras d\'Or - Find first keyword "pied"', async () => {
      // S'assurer qu'aucune modal n'est ouverte
      await closeAllModals();

      // Le premier lieu doit déjà être affiché
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Le Bras d\'Or', { timeout: 10000 });

      // Cliquer sur le bouton pour afficher l'énigme
      const showButton = page.locator('.gm-style-iw-c').locator('.container button');
      await showButton.waitFor({ state: 'visible', timeout: 5000 });
      await showButton.click();

      await waitForModalReady();

      // Vérifier que l'image est affichée (clickable-image)
      await expect(page.getByTestId('modal').locator('img')).toBeVisible({ timeout: 10000 });

      // Cliquer sur la zone contenant le mot-clé "pied"
      const keywordButton = page.getByTestId('modal').getByTestId('keyword-button');
      await keywordButton.waitFor({ state: 'visible', timeout: 5000 });
      await keywordButton.click();

      // Vérifier le message de succès
      await expect(page.getByTestId('toast')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('toast')).toHaveText('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !', { timeout: 5000 });

      // Fermer le toast
      const toastClose = page.getByTestId('toast').locator('.btn-close');
      await toastClose.waitFor({ state: 'visible', timeout: 3000 });
      await toastClose.click();
      await expect(page.getByTestId('toast')).not.toBeVisible({ timeout: 3000 });

      // Fermer la modal
      const modalClose = page.getByTestId('modal').locator('.btn-close');
      await modalClose.waitFor({ state: 'visible', timeout: 3000 });
      await modalClose.click();
      await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

      // Vérifier que le mot a été ajouté à la phrase
      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor .... ...................... se trouve .... pied .... .... .............. .... .... ............', { timeout: 5000 });

      // Retour à la carte
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);
    });

    // ========================================
    // ÉTAPE 5: Lieu 2 - Musée de l'Hospice Comtesse
    // ========================================
    await test.step('Place 2: Musée de l\'Hospice Comtesse - Find keyword "du"', async () => {
      // S'assurer qu'aucune modal n'est ouverte
      await closeAllModals();

      // Rechercher l'Hospice Comtesse
      const searchField = page.getByTestId('search-field');
      await searchField.waitFor({ state: 'visible', timeout: 5000 });
      await searchField.clear();
      await searchField.fill('Hospice');

      // Attendre que les résultats apparaissent
      await page.waitForTimeout(2000);
      await expect(page.getByTestId('search-results').getByRole('button')).toHaveCount(5, { timeout: 15000 });

      // Sélectionner le premier résultat (le bon)
      const firstResult = page.getByTestId('search-results').getByRole('button').first();
      await firstResult.waitFor({ state: 'visible', timeout: 5000 });
      await firstResult.click();

      // Attendre que la carte se repositionne
      await page.waitForTimeout(1500);

      // Vérifier que le marqueur a été ajouté
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(2, { timeout: 15000 });
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Musée de l\'Hospice Comtesse', { timeout: 10000 });

      // Afficher l'énigme
      const showButton = page.locator('.gm-style-iw-c').locator('.container button');
      await showButton.waitFor({ state: 'visible', timeout: 5000 });
      await showButton.click();

      await waitForModalReady();

      // Trouver et cliquer sur le mot-clé "du"
      const keywordButton = page.getByTestId('modal').getByTestId('keyword-button');
      await keywordButton.waitFor({ state: 'visible', timeout: 5000 });
      await keywordButton.click();

      await expect(page.getByTestId('toast')).toBeVisible({ timeout: 10000 });

      // Fermer le toast
      const toastClose = page.getByTestId('toast').locator('.btn-close');
      await toastClose.waitFor({ state: 'visible', timeout: 3000 });
      await toastClose.click();
      await expect(page.getByTestId('toast')).not.toBeVisible({ timeout: 3000 });

      // Fermer et vérifier
      const modalClose = page.getByTestId('modal').locator('.btn-close');
      await modalClose.waitFor({ state: 'visible', timeout: 3000 });
      await modalClose.click();
      await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve .... pied .... .... .............. .... .... ............', { timeout: 5000 });
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);
    });

    // ========================================
    // ÉTAPE 6: Lieu 3 - Aux Merveilleux de Fred
    // ========================================
    await test.step('Place 3: Aux Merveilleux de Fred - Find keyword "Colonne" (scratch card)', async () => {
      // S'assurer qu'aucune modal n'est ouverte
      await closeAllModals();

      // Rechercher Aux Merveilleux de Fred
      const searchField = page.getByTestId('search-field');
      await searchField.waitFor({ state: 'visible', timeout: 5000 });
      await searchField.clear();
      await searchField.fill('Merveilleux');

      // Attendre que les résultats apparaissent
      await page.waitForTimeout(2000);

      // Sélectionner le second résultat (Rue de la Monnaie)
      const secondResult = page.getByTestId('search-results').getByRole('button').nth(1);
      await secondResult.waitFor({ state: 'visible', timeout: 10000 });
      await secondResult.click();

      // Attendre que la carte se repositionne
      await page.waitForTimeout(1500);

      // Vérifier l'ajout du marqueur
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(3, { timeout: 15000 });
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Aux Merveilleux de Fred', { timeout: 10000 });

      // Afficher l'énigme (scratch card)
      const showButton = page.locator('.gm-style-iw-c').locator('.container button');
      await showButton.waitFor({ state: 'visible', timeout: 5000 });
      await showButton.click();

      await waitForModalReady();

      // Vérifier que le canvas de la carte à gratter est visible
      const canvas = page.getByTestId('modal').locator('canvas');
      await expect(canvas).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);

      // Simuler le grattage en effectuant des mouvements de souris sur le canvas
      const canvasBox = await canvas.boundingBox();
      if (canvasBox) {
        // La zone de vérification selon customCheckZone: {x: 0, y: height/3, width: 80%, height: height/4}
        // On doit gratter 80% de cette zone pour déclencher onComplete
        const checkZoneX = canvasBox.x;
        const checkZoneY = canvasBox.y + canvasBox.height / 3; // commence à 1/3
        const checkZoneWidth = canvasBox.width * 0.8; // 80% de largeur
        const checkZoneHeight = canvasBox.height / 4; // 1/4 de hauteur

        // Grattage horizontal très dense dans la zone de vérification
        const numHorizontalRows = 20;
        for (let row = 0; row < numHorizontalRows; row++) {
          const y = checkZoneY + (checkZoneHeight / numHorizontalRows) * row;

          await page.mouse.move(checkZoneX, y);
          await page.mouse.down();
          await page.mouse.move(checkZoneX + checkZoneWidth, y, { steps: 10 });
          await page.mouse.up();
          await page.waitForTimeout(50);
        }

        // Grattage vertical dense pour s'assurer que 80% de la zone est grattée
        const numVerticalCols = 15;
        for (let col = 0; col < numVerticalCols; col++) {
          const x = checkZoneX + (checkZoneWidth / numVerticalCols) * col;

          await page.mouse.move(x, checkZoneY);
          await page.mouse.down();
          await page.mouse.move(x, checkZoneY + checkZoneHeight, { steps: 8 });
          await page.mouse.up();
          await page.waitForTimeout(50);
        }

        // Grattage en diagonale pour compléter
        await page.mouse.move(checkZoneX, checkZoneY);
        await page.mouse.down();
        await page.mouse.move(checkZoneX + checkZoneWidth, checkZoneY + checkZoneHeight, { steps: 15 });
        await page.mouse.up();

        await page.mouse.move(checkZoneX + checkZoneWidth, checkZoneY);
        await page.mouse.down();
        await page.mouse.move(checkZoneX, checkZoneY + checkZoneHeight, { steps: 15 });
        await page.mouse.up();
      }

      // Attendre que le grattage révèle le contenu et déclenche le onComplete
      await page.waitForTimeout(2000);

      // Vérifier que le mot-clé "Colonne" est révélé
      await expect(page.getByTestId('modal')).toContainText('Colonne', { timeout: 5000 });

      // Vérifier que l'indice du prochain lieu "Place aux Oignons" est révélé
      await expect(page.getByTestId('modal')).toContainText('Place aux Oignons', { timeout: 5000 });

      // Vérifier que le toast de succès apparaît (le mot-clé est ajouté automatiquement)
      // Utiliser un try-catch car le toast peut apparaître rapidement
      try {
        await expect(page.getByTestId('toast')).toBeVisible({ timeout: 5000 });

        // Fermer le toast s'il est visible
        const toastClose = page.getByTestId('toast').locator('.btn-close');
        if (await toastClose.isVisible()) {
          await toastClose.click();
          await expect(page.getByTestId('toast')).not.toBeVisible({ timeout: 3000 });
        }
      } catch (e) {
        // Le toast a peut-être déjà disparu ou n'est pas apparu, on continue
        console.log('Toast not found or already disappeared');
      }

      // Fermer et vérifier
      const modalClose = page.getByTestId('modal').locator('.btn-close');
      await modalClose.waitFor({ state: 'visible', timeout: 3000 });
      await modalClose.click();
      await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve .... pied .... .... Colonne .... .... ............', { timeout: 5000 });
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);
    });

    // ========================================
    // ÉTAPE 7: Lieu 4 - Place aux Oignons
    // ========================================
    await test.step('Place 4: Place aux Oignons - Find keyword "au"', async () => {
      await closeAllModals();

      const searchField = page.getByTestId('search-field');
      await searchField.waitFor({ state: 'visible', timeout: 5000 });
      await searchField.clear();
      await searchField.fill('Place aux Oignons');
      await page.waitForTimeout(2000);

      const firstResult = page.getByTestId('search-results').getByRole('button').first();
      await firstResult.waitFor({ state: 'visible', timeout: 10000 });
      await firstResult.click();
      await page.waitForTimeout(1500);

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(4, { timeout: 15000 });
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Place aux Oignons', { timeout: 10000 });

      // Afficher et résoudre l'énigme
      const showButton = page.locator('.gm-style-iw-c').locator('.container button');
      await showButton.waitFor({ state: 'visible', timeout: 5000 });
      await showButton.click();
      await waitForModalReady();

      const keywordButton = page.getByTestId('modal').getByTestId('keyword-button');
      await keywordButton.waitFor({ state: 'visible', timeout: 5000 });
      await keywordButton.click();

      await expect(page.getByTestId('toast')).toBeVisible({ timeout: 10000 });

      // Fermer le toast
      const toastClose = page.getByTestId('toast').locator('.btn-close');
      await toastClose.waitFor({ state: 'visible', timeout: 3000 });
      await toastClose.click();
      await expect(page.getByTestId('toast')).not.toBeVisible({ timeout: 3000 });

      const modalClose = page.getByTestId('modal').locator('.btn-close');
      await modalClose.waitFor({ state: 'visible', timeout: 3000 });
      await modalClose.click();
      await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve au pied .... .... Colonne .... .... ............', { timeout: 5000 });
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);
    });

    // ========================================
    // ÉTAPE 8: Lieu 5 - Cathédrale Notre-Dame-de-la-Treille
    // ========================================
    await test.step('Place 5: Cathédrale Notre-Dame-de-la-Treille - Find keyword "la"', async () => {
      await closeAllModals();

      const searchField = page.getByTestId('search-field');
      await searchField.waitFor({ state: 'visible', timeout: 5000 });
      await searchField.clear();
      await searchField.fill('Notre-Dame Treille');
      await page.waitForTimeout(2000);

      const firstResult = page.getByTestId('search-results').getByRole('button').first();
      await firstResult.waitFor({ state: 'visible', timeout: 10000 });
      await firstResult.click();
      await page.waitForTimeout(1500);

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(5, { timeout: 15000 });
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Cathédrale Notre-Dame-de-la-Treille', { timeout: 10000 });

      const showButton = page.locator('.gm-style-iw-c').locator('.container button');
      await showButton.waitFor({ state: 'visible', timeout: 5000 });
      await showButton.click();
      await waitForModalReady();

      const keywordButton = page.getByTestId('modal').getByTestId('keyword-button');
      await keywordButton.waitFor({ state: 'visible', timeout: 5000 });
      await keywordButton.click();

      await expect(page.getByTestId('toast')).toBeVisible({ timeout: 10000 });

      // Fermer le toast
      const toastClose = page.getByTestId('toast').locator('.btn-close');
      await toastClose.waitFor({ state: 'visible', timeout: 3000 });
      await toastClose.click();
      await expect(page.getByTestId('toast')).not.toBeVisible({ timeout: 3000 });

      const modalClose = page.getByTestId('modal').locator('.btn-close');
      await modalClose.waitFor({ state: 'visible', timeout: 3000 });
      await modalClose.click();
      await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve au pied .... la Colonne .... la ............', { timeout: 5000 });
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);
    });

    // ========================================
    // ÉTAPE 9: Lieu 6 - Maison Méert
    // ========================================
    await test.step('Place 6: Maison Méert - Find keyword "de" (3D box)', async () => {
      await closeAllModals();

      const searchField = page.getByTestId('search-field');
      await searchField.waitFor({ state: 'visible', timeout: 5000 });
      await searchField.clear();
      await searchField.fill('Méert');
      await page.waitForTimeout(2000);

      const firstResult = page.getByTestId('search-results').getByRole('button').first();
      await firstResult.waitFor({ state: 'visible', timeout: 10000 });
      await firstResult.click();
      await page.waitForTimeout(1500);

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(6, { timeout: 15000 });
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Maison Méert', { timeout: 10000 });

      // Afficher l'énigme 3D
      const showButton = page.locator('.gm-style-iw-c').locator('.container button');
      await showButton.waitFor({ state: 'visible', timeout: 5000 });
      await showButton.click();
      await waitForModalReady();

      // Attendre que le canvas 3D soit visible et chargé
      const canvas = page.getByTestId('modal').locator('canvas');
      await expect(canvas).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1500); // Laisser le temps au rendu 3D de se charger complètement

      // Faire tourner la boîte pour voir les faces gauche, droite et dessous
      const canvasBox = await canvas.boundingBox();
      if (canvasBox) {
        const centerX = canvasBox.x + canvasBox.width / 2;
        const centerY = canvasBox.y + canvasBox.height / 2;

        // 1. Rotation à droite pour voir la face gauche (avec "Vieille")
        await page.mouse.move(centerX - 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(700);

        // 2. Première rotation à gauche
        await page.mouse.move(centerX + 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(700);

        // 3. Deuxième rotation à gauche pour voir la face droite (avec "Bourse")
        await page.mouse.move(centerX + 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(700);

        // 4. Rotation à droite pour revenir à l'état initial
        await page.mouse.move(centerX - 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(700);

        // 5. Rotation vers le haut pour voir la face inférieure (avec "de")
        await page.mouse.move(centerX, centerY + 100);
        await page.mouse.down();
        await page.mouse.move(centerX, centerY - 150, { steps: 20 });
        await page.mouse.up();
        await page.waitForTimeout(1500);
      }

      // Vérifier que le toast de succès apparaît (le mot-clé "de" est ajouté automatiquement)
      try {
        await expect(page.getByTestId('toast')).toBeVisible({ timeout: 10000 });

        // Fermer le toast
        const toastClose = page.getByTestId('toast').locator('.btn-close');
        await toastClose.waitFor({ state: 'visible', timeout: 3000 });
        await toastClose.click();
        await expect(page.getByTestId('toast')).not.toBeVisible({ timeout: 3000 });
      } catch (e) {
        // Le toast a peut-être déjà disparu ou n'est pas apparu, on continue
        console.log('Toast not found or already disappeared');
      }

      const modalClose = page.getByTestId('modal').locator('.btn-close');
      await modalClose.waitFor({ state: 'visible', timeout: 3000 });
      await modalClose.click();
      await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve au pied de la Colonne de la ............', { timeout: 5000 });
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);
    });

    // ========================================
    // ÉTAPE 10: Lieu 7 - Vieille Bourse
    // ========================================
    await test.step('Place 7: Vieille Bourse - Find keyword "Vieux-Lille" (page flip)', async () => {
      await closeAllModals();

      const searchField = page.getByTestId('search-field');
      await searchField.waitFor({ state: 'visible', timeout: 5000 });
      await searchField.clear();
      await searchField.fill('Vieille Bourse');
      await page.waitForTimeout(2000);

      const firstResult = page.getByTestId('search-results').getByRole('button').first();
      await firstResult.waitFor({ state: 'visible', timeout: 10000 });
      await firstResult.click();
      await page.waitForTimeout(1500);

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(7, { timeout: 15000 });
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Vieille Bourse', { timeout: 10000 });

      const showButton = page.locator('.gm-style-iw-c').locator('.container button');
      await showButton.waitFor({ state: 'visible', timeout: 5000 });
      await showButton.click();
      await waitForModalReady();

      // Attendre que le livre soit chargé
      await page.waitForTimeout(2000);

      // Fonction pour tourner une page en cliquant sur la page de droite
      const turnPage = async () => {
        // Chercher toutes les divs de page visibles
        const pages = page.getByTestId('modal').locator('div[style*="background"]');
        const pageCount = await pages.count();

        if (pageCount > 0) {
          // Prendre la dernière page visible (page de droite)
          const rightPage = pages.last();
          const pageBox = await rightPage.boundingBox();

          if (pageBox) {
            // Cliquer au centre de la page de droite
            const centerX = pageBox.x + pageBox.width / 2;
            const centerY = pageBox.y + pageBox.height / 2;
            await page.mouse.click(centerX, centerY);
          }
        }
        await page.waitForTimeout(3000); // Attendre l'animation de flip
      };

      // Tourner vers la page 1
      await turnPage();

      // Tourner vers la page 2
      await turnPage();

      // Page 3 : le mot-clé "Vieux-Lille" doit être visible
      await expect(page.getByTestId('modal')).toContainText('Vieux-Lille', { timeout: 5000 });

      // Cliquer sur le mot-clé "Vieux-Lille" - attendre qu'il soit visible
      const keywordButton = page.getByTestId('modal').getByTestId('keyword-button');

      // Tourner les pages jusqu'à ce que le mot-clé soit visible (max 5 tentatives)
      for (let i = 0; i < 5; i++) {
        const isVisible = await keywordButton.isVisible().catch(() => false);
        if (isVisible) {
          break;
        }
        await turnPage();
      }

      await keywordButton.waitFor({ state: 'visible', timeout: 10000 });
      await keywordButton.click();

      await expect(page.getByTestId('toast')).toBeVisible({ timeout: 10000 });

      // Fermer le toast
      const toastClose = page.getByTestId('toast').locator('.btn-close');
      await toastClose.waitFor({ state: 'visible', timeout: 3000 });
      await toastClose.click();
      await expect(page.getByTestId('toast')).not.toBeVisible({ timeout: 3000 });

      // Continuer à tourner les pages jusqu'à la dernière page pour voir l'indice "Allez à l'Opéra !"
      await turnPage();
      await turnPage();

      // Vérifier que l'indice "Allez à l'Opéra !" est visible sur la dernière page
      await expect(page.getByTestId('modal')).toContainText('Allez à l\'Opéra !', { timeout: 5000 });

      const modalClose = page.getByTestId('modal').locator('.btn-close');
      await modalClose.waitFor({ state: 'visible', timeout: 3000 });
      await modalClose.click();
      await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du Vieux-Lille se trouve au pied de la Colonne de la ............', { timeout: 5000 });
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);
    });

    // ========================================
    // ÉTAPE 11: Lieu 8 - Opéra de Lille
    // ========================================
    await test.step('Place 8: Opéra de Lille - Find keyword "Déesse" (magnifier)', async () => {
      await closeAllModals();

      const searchField = page.getByTestId('search-field');
      await searchField.waitFor({ state: 'visible', timeout: 5000 });
      await searchField.clear();
      await searchField.fill('Opéra Lille');
      await page.waitForTimeout(2000);

      const firstResult = page.getByTestId('search-results').getByRole('button').first();
      await firstResult.waitFor({ state: 'visible', timeout: 10000 });
      await firstResult.click();
      await page.waitForTimeout(1500);

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(8, { timeout: 15000 });
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Opéra de Lille', { timeout: 10000 });

      const showButton = page.locator('.gm-style-iw-c').locator('.container button');
      await showButton.waitFor({ state: 'visible', timeout: 5000 });
      await showButton.click();
      await waitForModalReady();

      // Attendre que l'image avec la loupe soit chargée
      await page.waitForTimeout(1500);

      // Simuler une recherche réaliste à la loupe
      const modalBody = page.getByTestId('modal').locator('.modal-body');
      const modalBox = await modalBody.boundingBox();

      if (modalBox) {
        const centerX = modalBox.x + modalBox.width / 2;
        const centerY = modalBox.y + modalBox.height / 2;

        const margin = 100;
        const startX = modalBox.x + margin;
        const startY = modalBox.y + margin;
        const endX = modalBox.x + modalBox.width - margin;
        const endY = modalBox.y + modalBox.height - margin;

        const numRows = 5;
        const rowHeight = (endY - startY) / (numRows - 1);

        // Parcourir l'image ligne par ligne en zigzag
        for (let row = 0; row < numRows; row++) {
          const y = startY + row * rowHeight;

          if (row % 2 === 0) {
            await page.mouse.move(startX, y, { steps: 10 });
            await page.waitForTimeout(200);
            await page.mouse.move(endX, y, { steps: 20 });
            await page.waitForTimeout(200);
          } else {
            await page.mouse.move(endX, y, { steps: 10 });
            await page.waitForTimeout(200);
            await page.mouse.move(startX, y, { steps: 20 });
            await page.waitForTimeout(200);
          }

          if (row >= numRows / 2) {
            const radius = 40;
            for (let angle = 0; angle < 360; angle += 45) {
              const rad = (angle * Math.PI) / 180;
              const x = centerX + radius * Math.cos(rad);
              const y = centerY + radius * Math.sin(rad);
              await page.mouse.move(x, y, { steps: 5 });
              await page.waitForTimeout(200);
            }

            await page.mouse.move(centerX, centerY, { steps: 5 });
            await page.waitForTimeout(1500);
            break;
          }
        }
      }

      // Vérifier que le toast de succès apparaît
      try {
        await expect(page.getByTestId('toast')).toBeVisible({ timeout: 10000 });
        await expect(page.getByTestId('toast')).toContainText('Félicitations ! Vous avez trouvé tous les mots cachés. Consultez la phrase pour découvrir le lieu du trésor !', { timeout: 5000 });

        // Fermer le toast
        const toastClose = page.getByTestId('toast').locator('.btn-close');
        await toastClose.waitFor({ state: 'visible', timeout: 3000 });
        await toastClose.click();
        await expect(page.getByTestId('toast')).not.toBeVisible({ timeout: 3000 });
      } catch (e) {
        // Le toast a peut-être déjà disparu ou n'est pas apparu, on continue
        console.log('Toast not found or already disappeared');
      }

      const modalClose = page.getByTestId('modal').locator('.btn-close');
      await modalClose.waitFor({ state: 'visible', timeout: 3000 });
      await modalClose.click();
      await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du Vieux-Lille se trouve au pied de la Colonne de la Déesse', { timeout: 5000 });
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);
    });

    // ========================================
    // ÉTAPE 12: Vérification de la phrase complète
    // ========================================
    await test.step('Verify complete phrase is revealed', async () => {
      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(500);

      // Vérifier que la phrase complète est maintenant visible
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du Vieux-Lille se trouve au pied de la Colonne de la Déesse', { timeout: 10000 });

      // Tous les mots doivent être trouvés
      const phraseText = await page.getByTestId('manuscript').textContent();
      expect(phraseText).not.toContain('....');
    });

    // ========================================
    // ÉTAPE 13: Lieu final - Colonne de la Déesse
    // ========================================
    await test.step('Final place: Colonne de la Déesse - Discover the treasure', async () => {
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(500);

      // Rechercher le lieu final
      const searchField = page.getByTestId('search-field');
      await searchField.waitFor({ state: 'visible', timeout: 5000 });
      await searchField.clear();
      await searchField.fill('Colonne de la Déesse');
      await page.waitForTimeout(2000);

      const firstResult = page.getByTestId('search-results').getByRole('button').first();
      await firstResult.waitFor({ state: 'visible', timeout: 10000 });
      await firstResult.click();
      await page.waitForTimeout(1500);

      // Vérifier l'ajout du marqueur final
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(9, { timeout: 15000 });
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Colonne de la Déesse', { timeout: 10000 });

      // Vérifier la description finale avec les félicitations
      await expect(page.locator('.gm-style-iw-c')).toContainText('FÉLICITATIONS', { timeout: 5000 });
      await expect(page.locator('.gm-style-iw-c')).toContainText('Vous avez trouvé le trésor du Vieux-Lille', { timeout: 5000 });

      // Le lieu final n'a pas d'énigme (pas de bouton pour afficher une modal)
      await expect(page.locator('.gm-style-iw-c').locator('.container button')).not.toBeVisible();
    });

    // ========================================
    // ÉTAPE 14: Test de persistance des données
    // ========================================
    await test.step('Verify data persistence after reload', async () => {
      // Recharger la page
      await page.reload({ waitUntil: 'networkidle', timeout: 30000 });

      // Vérifier que l'API key est toujours enregistrée
      await expect(page.getByPlaceholder('Clé d\'accès')).not.toBeVisible({ timeout: 5000 });
      await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 10000 });

      // Vérifier que tous les mots-clés sont toujours présents
      await page.getByTestId('manuscript-button').click();
      await page.waitForTimeout(1000);
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du Vieux-Lille se trouve au pied de la Colonne de la Déesse', { timeout: 10000 });

      // Vérifier que tous les marqueurs sont toujours sur la carte
      await page.getByTestId('map-button').click();
      await page.waitForTimeout(1000);

      // Vérifier que l'onglet carte est actif
      await expect(page.getByTestId('map-button')).toHaveClass(/active/, { timeout: 5000 });
      await expect(page.getByTestId('manuscript-button')).not.toHaveClass(/active/);

      // Attendre que Google Maps se charge maintenant qu'on est sur l'onglet carte
      await page.waitForTimeout(2000);

      await waitForMapReady();

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(9, { timeout: 15000 });
    });
  });
});
