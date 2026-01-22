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
    // ========================================
    // ÉTAPE 1: Initialisation de l'application
    // ========================================
    await test.step('Initialize application and enter API key', async () => {
      await page.goto('/');

      // Vérifier que la page de sécurité est affichée
      await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

      // Entrer la clé d'accès
      await page.getByPlaceholder('Clé d\'accès').fill(process.env.GOOGLE_MAPS_API_KEY as string);
      await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

      // Vérifier que l'application est chargée
      await expect(page.getByTestId('hunt-title')).toBeVisible();
      await expect(page.getByTestId('hunt-title')).toContainText('Le Trésor du Vieux-Lille');
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
      await page.getByTestId('map-button').click();

      // Vérifier que l'onglet carte est actif
      await expect(page.getByTestId('map-button')).toHaveClass('nav-link active');
      await expect(page.getByTestId('manuscript-button')).not.toHaveClass('nav-link active');

      // Vérifier la présence du champ de recherche
      await expect(page.getByTestId('search-field')).toBeVisible();

      // Vérifier qu'un marqueur est déjà présent (premier lieu)
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(1);
      await expect(page.locator('.gm-style-iw-c')).toBeVisible();
    });

    // ========================================
    // ÉTAPE 4: Lieu 1 - Le Bras d'Or
    // ========================================
    await test.step('Place 1: Le Bras d\'Or - Find first keyword "pied"', async () => {
      // Le premier lieu doit déjà être affiché
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Le Bras d\'Or');

      // Cliquer sur le bouton pour afficher l'énigme
      await page.locator('.gm-style-iw-c').locator('.container button').click();
      await expect(page.getByTestId('modal')).toBeVisible();

      // Vérifier que l'image est affichée (clickable-image)
      await expect(page.getByTestId('modal').locator('img')).toBeVisible();

      // Cliquer sur la zone contenant le mot-clé "pied"
      await page.getByTestId('modal').getByTestId('keyword-button').click();

      // Vérifier le message de succès
      await expect(page.getByTestId('toast')).toHaveText('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !');

      // Fermer le toast
      await page.getByTestId('toast').locator('.btn-close').click();

      // Fermer la modal
      await page.getByTestId('modal').locator('.btn-close').click();
      await expect(page.getByTestId('modal')).not.toBeVisible();

      // Vérifier que le mot a été ajouté à la phrase
      await page.getByTestId('manuscript-button').click();
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor .... ...................... se trouve .... pied .... .... .............. .... .... ............');

      // Retour à la carte
      await page.getByTestId('map-button').click();
    });

    // ========================================
    // ÉTAPE 5: Lieu 2 - Musée de l'Hospice Comtesse
    // ========================================
    await test.step('Place 2: Musée de l\'Hospice Comtesse - Find keyword "du"', async () => {
      // Rechercher l'Hospice Comtesse
      await page.getByTestId('search-field').fill('Hospice');
      await expect(page.getByTestId('search-results').getByRole('button')).toHaveCount(5);

      // Sélectionner le premier résultat (le bon)
      await page.getByTestId('search-results').getByRole('button').first().click();

      // Vérifier que le marqueur a été ajouté
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(2);
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Musée de l\'Hospice Comtesse');

      // Afficher l'énigme
      await page.locator('.gm-style-iw-c').locator('.container button').click();
      await expect(page.getByTestId('modal')).toBeVisible();

      // Trouver et cliquer sur le mot-clé "du"
      await page.getByTestId('modal').getByTestId('keyword-button').click();
      await expect(page.getByTestId('toast')).toBeVisible();

      // Fermer le toast
      await page.getByTestId('toast').locator('.btn-close').click();

      // Fermer et vérifier
      await page.getByTestId('modal').locator('.btn-close').click();
      await page.getByTestId('manuscript-button').click();
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve .... pied .... .... .............. .... .... ............');
      await page.getByTestId('map-button').click();
    });

    // ========================================
    // ÉTAPE 6: Lieu 3 - Aux Merveilleux de Fred
    // ========================================
    await test.step('Place 3: Aux Merveilleux de Fred - Find keyword "Colonne" (scratch card)', async () => {
      // Rechercher Aux Merveilleux de Fred
      await page.getByTestId('search-field').fill('Merveilleux');

      // Sélectionner le second résultat (Rue de la Monnaie)
      await page.getByTestId('search-results').getByRole('button').nth(1).click();

      // Vérifier l'ajout du marqueur
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(3);
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Aux Merveilleux de Fred');

      // Afficher l'énigme (scratch card)
      await page.locator('.gm-style-iw-c').locator('.container button').click();
      await expect(page.getByTestId('modal')).toBeVisible();

      // Vérifier que le canvas de la carte à gratter est visible
      const canvas = page.getByTestId('modal').locator('canvas');
      await expect(canvas).toBeVisible();

      // Simuler le grattage en effectuant des mouvements de souris sur le canvas
      const canvasBox = await canvas.boundingBox();
      if (canvasBox) {
        // Gratter une zone suffisante pour déclencher la révélation (80% selon le code)
        const checkZoneX = canvasBox.x + canvasBox.width / 6;
        const checkZoneY = canvasBox.y + canvasBox.height / 6;
        const checkZoneWidth = canvasBox.width * 0.9;
        const checkZoneHeight = canvasBox.height * 0.9;

        // Grattage horizontal dense - passes horizontales rapprochées
        const numHorizontalRows = 12; // Beaucoup plus de lignes horizontales
        for (let row = 0; row < numHorizontalRows; row++) {
          const y = checkZoneY + (checkZoneHeight / (numHorizontalRows - 1)) * row;

          await page.mouse.move(checkZoneX, y);
          await page.mouse.down();
          await page.mouse.move(checkZoneX + checkZoneWidth, y);
          await page.mouse.up();
        }

        // Grattage vertical dense - passes verticales pour compléter
        const numVerticalCols = 12; // Beaucoup de lignes verticales aussi
        for (let col = 0; col < numVerticalCols; col++) {
          const x = checkZoneX + (checkZoneWidth / (numVerticalCols - 1)) * col;

          await page.mouse.move(x, checkZoneY);
          await page.mouse.down();
          await page.mouse.move(x, checkZoneY + checkZoneHeight);
          await page.mouse.up();
        }
      }

      // Attendre que le grattage révèle le contenu et déclenche le onComplete
      await page.waitForTimeout(1500);

      // Vérifier que le mot-clé "Colonne" est révélé
      await expect(page.getByTestId('modal')).toContainText('Colonne');

      // Vérifier que l'indice du prochain lieu "Place aux Oignons" est révélé
      await expect(page.getByTestId('modal')).toContainText('Place aux Oignons');

      // Vérifier que le toast de succès apparaît (le mot-clé est ajouté automatiquement)
      await expect(page.getByTestId('toast')).toBeVisible();

      // Fermer le toast
      await page.getByTestId('toast').locator('.btn-close').click();

      // Fermer et vérifier
      await page.getByTestId('modal').locator('.btn-close').click();
      await page.getByTestId('manuscript-button').click();
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve .... pied .... .... Colonne .... .... ............');
      await page.getByTestId('map-button').click();
    });

    // ========================================
    // ÉTAPE 7: Lieu 4 - Place aux Oignons
    // ========================================
    await test.step('Place 4: Place aux Oignons - Find keyword "au"', async () => {
      await page.getByTestId('search-field').fill('Place aux Oignons');
      await page.getByTestId('search-results').getByRole('button').first().click();

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(4);
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Place aux Oignons');

      // Afficher et résoudre l'énigme
      await page.locator('.gm-style-iw-c').locator('.container button').click();
      await expect(page.getByTestId('modal')).toBeVisible();

      await page.getByTestId('modal').getByTestId('keyword-button').click();
      await expect(page.getByTestId('toast')).toBeVisible();

      // Fermer le toast
      await page.getByTestId('toast').locator('.btn-close').click();

      await page.getByTestId('modal').locator('.btn-close').click();
      await page.getByTestId('manuscript-button').click();
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve au pied .... .... Colonne .... .... ............');
      await page.getByTestId('map-button').click();
    });

    // ========================================
    // ÉTAPE 8: Lieu 5 - Cathédrale Notre-Dame-de-la-Treille
    // ========================================
    await test.step('Place 5: Cathédrale Notre-Dame-de-la-Treille - Find keyword "la"', async () => {
      await page.getByTestId('search-field').fill('Notre-Dame Treille');
      await page.getByTestId('search-results').getByRole('button').first().click();

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(5);
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Cathédrale Notre-Dame-de-la-Treille');

      await page.locator('.gm-style-iw-c').locator('.container button').click();
      await expect(page.getByTestId('modal')).toBeVisible();

      await page.getByTestId('modal').getByTestId('keyword-button').click();
      await expect(page.getByTestId('toast')).toBeVisible();

      // Fermer le toast
      await page.getByTestId('toast').locator('.btn-close').click();

      await page.getByTestId('modal').locator('.btn-close').click();
      await page.getByTestId('manuscript-button').click();
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve au pied .... la Colonne .... la ............');
      await page.getByTestId('map-button').click();
    });

    // ========================================
    // ÉTAPE 9: Lieu 6 - Maison Méert
    // ========================================
    await test.step('Place 6: Maison Méert - Find keyword "de" (3D box)', async () => {
      await page.getByTestId('search-field').fill('Méert');
      await page.getByTestId('search-results').getByRole('button').first().click();

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(6);
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Maison Méert');

      // Afficher l'énigme 3D
      await page.locator('.gm-style-iw-c').locator('.container button').click();
      await expect(page.getByTestId('modal')).toBeVisible();

      // Attendre que le canvas 3D soit visible et chargé
      const canvas = page.getByTestId('modal').locator('canvas');
      await expect(canvas).toBeVisible();
      await page.waitForTimeout(1000); // Laisser le temps au rendu 3D

      // Faire tourner la boîte pour voir les faces gauche, droite et dessous
      const canvasBox = await canvas.boundingBox();
      if (canvasBox) {
        const centerX = canvasBox.x + canvasBox.width / 2;
        const centerY = canvasBox.y + canvasBox.height / 2;

        // 1. Rotation à droite pour voir la face gauche (avec "Vieille")
        // Drag horizontal de gauche vers droite
        await page.mouse.move(centerX - 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        // 2. Première rotation à gauche
        // Drag horizontal de droite vers gauche
        await page.mouse.move(centerX + 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        // 3. Deuxième rotation à gauche pour voir la face droite (avec "Bourse")
        // Drag horizontal de droite vers gauche
        await page.mouse.move(centerX + 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        // 4. Rotation à droite pour revenir à l'état initial
        // Drag horizontal de gauche vers droite
        await page.mouse.move(centerX - 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        // 5. Rotation vers le haut pour voir la face inférieure (avec "de")
        // Drag vertical de bas vers haut pour basculer la vue vers le dessous
        await page.mouse.move(centerX, centerY + 100);
        await page.mouse.down();
        await page.mouse.move(centerX, centerY - 150, { steps: 20 });
        await page.mouse.up();
        await page.waitForTimeout(1000);
      }

      // Vérifier que le toast de succès apparaît (le mot-clé "de" est ajouté automatiquement)
      await expect(page.getByTestId('toast')).toBeVisible();

      // Fermer le toast
      await page.getByTestId('toast').locator('.btn-close').click();

      await page.getByTestId('modal').locator('.btn-close').click();
      await page.getByTestId('manuscript-button').click();
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du ...................... se trouve au pied de la Colonne de la ............');
      await page.getByTestId('map-button').click();
    });

    // ========================================
    // ÉTAPE 10: Lieu 7 - Vieille Bourse
    // ========================================
    await test.step('Place 7: Vieille Bourse - Find keyword "Vieux-Lille" (page flip)', async () => {
      await page.getByTestId('search-field').fill('Vieille Bourse');
      await page.getByTestId('search-results').getByRole('button').first().click();

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(7);
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Vieille Bourse');

      await page.locator('.gm-style-iw-c').locator('.container button').click();
      await expect(page.getByTestId('modal')).toBeVisible();

      // Attendre que le livre soit chargé
      await page.waitForTimeout(1500);

      // Pour tourner les pages sur mobile, il faut cliquer sur la page de droite
      // HTMLFlipBook utilise des divs avec la classe provenant du module CSS
      // On va cibler les pages visibles et cliquer au centre de la page de droite

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

      // Page 3 : le mot-clé "Vieux-Lille" doit être visible et cliquable
      await expect(page.getByTestId('modal')).toContainText('Vieux-Lille');

      // Cliquer sur le mot-clé "Vieux-Lille"
      await page.getByTestId('modal').getByTestId('keyword-button').click();
      await expect(page.getByTestId('toast')).toBeVisible();

      // Fermer le toast
      await page.getByTestId('toast').locator('.btn-close').click();

      // Continuer à tourner les pages jusqu'à la dernière page pour voir l'indice "Allez à l'Opéra !"
      await turnPage();
      await turnPage();

      // Vérifier que l'indice "Allez à l'Opéra !" est visible sur la dernière page
      await expect(page.getByTestId('modal')).toContainText('Allez à l\'Opéra !');

      await page.getByTestId('modal').locator('.btn-close').click();
      await page.getByTestId('manuscript-button').click();
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du Vieux-Lille se trouve au pied de la Colonne de la ............');
      await page.getByTestId('map-button').click();
    });

    // ========================================
    // ÉTAPE 11: Lieu 8 - Opéra de Lille
    // ========================================
    await test.step('Place 8: Opéra de Lille - Find keyword "Déesse" (magnifier)', async () => {
      await page.getByTestId('search-field').fill('Opéra Lille');
      await page.getByTestId('search-results').getByRole('button').first().click();

      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(8);
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Opéra de Lille');

      await page.locator('.gm-style-iw-c').locator('.container button').click();
      await expect(page.getByTestId('modal')).toBeVisible();

      // Attendre que l'image avec la loupe soit chargée
      await page.waitForTimeout(1000);

      // Pour une loupe, il faut parcourir l'image avec le curseur pour découvrir le mot-clé caché
      // Le mot-clé "Déesse" est situé approximativement au centre de l'image
      // Simuler une recherche réaliste : l'utilisateur ne sait pas où se trouve le mot-clé
      // et parcourt l'image méthodiquement avec la loupe

      const modalBody = page.getByTestId('modal').locator('.modal-body');
      const modalBox = await modalBody.boundingBox();

      if (modalBox) {
        const centerX = modalBox.x + modalBox.width / 2;
        const centerY = modalBox.y + modalBox.height / 2;

        // Définir une grille de recherche pour parcourir l'image méthodiquement
        // On divise l'image en zones et on parcourt en zigzag
        const margin = 100;
        const startX = modalBox.x + margin;
        const startY = modalBox.y + margin;
        const endX = modalBox.x + modalBox.width - margin;
        const endY = modalBox.y + modalBox.height - margin;

        // Nombre de lignes horizontales à parcourir
        const numRows = 5;
        const rowHeight = (endY - startY) / (numRows - 1);

        // Parcourir l'image ligne par ligne en zigzag (comme un balayage)
        for (let row = 0; row < numRows; row++) {
          const y = startY + row * rowHeight;

          // Si ligne paire : aller de gauche à droite
          // Si ligne impaire : aller de droite à gauche (zigzag)
          if (row % 2 === 0) {
            // Gauche vers droite
            await page.mouse.move(startX, y, { steps: 10 });
            await page.waitForTimeout(200);
            await page.mouse.move(endX, y, { steps: 20 });
            await page.waitForTimeout(200);
          } else {
            // Droite vers gauche
            await page.mouse.move(endX, y, { steps: 10 });
            await page.waitForTimeout(200);
            await page.mouse.move(startX, y, { steps: 20 });
            await page.waitForTimeout(200);
          }

          // Si on a parcouru environ la moitié de l'image, on devrait avoir trouvé le mot-clé au centre
          // On peut ralentir et faire des mouvements plus précis autour du centre
          if (row >= numRows / 2) {
            // Faire quelques mouvements circulaires autour du centre pour bien couvrir la zone
            const radius = 40;
            for (let angle = 0; angle < 360; angle += 45) {
              const rad = (angle * Math.PI) / 180;
              const x = centerX + radius * Math.cos(rad);
              const y = centerY + radius * Math.sin(rad);
              await page.mouse.move(x, y, { steps: 5 });
              await page.waitForTimeout(200);
            }

            // Passer par le centre exact
            await page.mouse.move(centerX, centerY, { steps: 5 });
            await page.waitForTimeout(1000); // Rester sur le centre pour que la loupe couvre le mot-clé

            // Sortir de la boucle si on a trouvé le mot-clé
            break;
          }
        }
      }

      // Vérifier que le toast de succès apparaît (le mot-clé est ajouté automatiquement au survol)
      await expect(page.getByTestId('toast')).toBeVisible();
      await expect(page.getByTestId('toast')).toContainText('Félicitations ! Vous avez trouvé tous les mots cachés. Consultez la phrase pour découvrir le lieu du trésor !');

      // Fermer le toast
      await page.getByTestId('toast').locator('.btn-close').click();

      await page.getByTestId('modal').locator('.btn-close').click();
      await page.getByTestId('manuscript-button').click();
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du Vieux-Lille se trouve au pied de la Colonne de la Déesse');
      await page.getByTestId('map-button').click();
    });

    // ========================================
    // ÉTAPE 12: Vérification de la phrase complète
    // ========================================
    await test.step('Verify complete phrase is revealed', async () => {
      await page.getByTestId('manuscript-button').click();

      // Vérifier que la phrase complète est maintenant visible
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du Vieux-Lille se trouve au pied de la Colonne de la Déesse');

      // Tous les mots doivent être trouvés
      const phraseText = await page.getByTestId('manuscript').textContent();
      expect(phraseText).not.toContain('....');
    });

    // ========================================
    // ÉTAPE 13: Lieu final - Colonne de la Déesse
    // ========================================
    await test.step('Final place: Colonne de la Déesse - Discover the treasure', async () => {
      await page.getByTestId('map-button').click();

      // Rechercher le lieu final
      await page.getByTestId('search-field').fill('Colonne de la Déesse');
      await page.getByTestId('search-results').getByRole('button').first().click();

      // Vérifier l'ajout du marqueur final
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(9);
      await expect(page.locator('.gm-style-iw-c').locator('h5')).toContainText('Colonne de la Déesse');

      // Vérifier la description finale avec les félicitations
      await expect(page.locator('.gm-style-iw-c')).toContainText('FÉLICITATIONS');
      await expect(page.locator('.gm-style-iw-c')).toContainText('Vous avez trouvé le trésor du Vieux-Lille');

      // Le lieu final n'a pas d'énigme (pas de bouton pour afficher une modal)
      await expect(page.locator('.gm-style-iw-c').locator('.container button')).not.toBeVisible();
    });

    // ========================================
    // ÉTAPE 14: Test de persistance des données
    // ========================================
    await test.step('Verify data persistence after reload', async () => {
      // Recharger la page
      await page.reload();

      // Vérifier que l'API key est toujours enregistrée
      await expect(page.getByPlaceholder('Clé d\'accès')).not.toBeVisible();
      await expect(page.getByTestId('hunt-title')).toBeVisible();

      // Vérifier que tous les mots-clés sont toujours présents
      await expect(page.getByTestId('manuscript')).toContainText('Le trésor du Vieux-Lille se trouve au pied de la Colonne de la Déesse');

      // Vérifier que tous les marqueurs sont toujours sur la carte
      await page.getByTestId('map-button').click();
      await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(9);
    });
  });
});
