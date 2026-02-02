export const translations = {
  fr: {
    // Common
    loading: 'Chargement...',

    // Metadata
    appTitle: 'Chasses au trésor',
    appDescription: 'Choisissez votre chasse au trésor',
    huntNotFoundTitle: 'Jeu introuvable',

    // Mobile & Orientation
    mobileOnly: 'Cette application est uniquement compatible sur mobile.',
    mobileOnlyHelper: 'Veuillez l\'ouvrir sur votre mobile.',
    landscapeNotSupported: 'Le mode paysage n\'est pas supporté.',

    // API Key
    apiKeyLabel: 'Clé d\'accès',
    apiKeyPlaceholder: 'Clé d\'accès',
    apiKeyHelper: 'Veuillez renseigner la clé d\'accès fournie par votre hôte.',
    apiKeyInvalid: 'La clé saisie semble invalide. Merci de vérifier votre saisie.',
    apiKeySave: 'Enregistrer',

    // Password for decryption
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: 'Entrez le mot de passe',
    passwordHelper: 'Veuillez entrer le mot de passe fourni par votre hôte pour déverrouiller l\'application.',
    passwordInvalid: 'Mot de passe incorrect. Veuillez réessayer.',
    unlock: 'Déverrouiller',
    decrypting: 'Déchiffrement en cours...',
    error: 'Erreur',
    noEncryptedKey: 'Aucune clé chiffrée trouvée. Veuillez déployer l\'application avec un mot de passe.',

    // Hunts List
    huntsListTitle: 'Chasses au trésor disponibles',
    huntStart: 'Commencer',

    // Not Found
    notFoundTitle: '404 - Jeu introuvable',
    notFoundMessage: 'Le jeu que vous recherchez n\'existe pas ou a été supprimé.',
    notFoundBackButton: 'Retour à la liste des jeux',

    // Toast messages
    keywordFound: 'Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !',
    keywordAlreadyFound: 'Vous avez déjà trouvé ce mot-clé !',

    // Map
    searchPlaceholder: 'Rechercher un lieu...',
    noResults: 'Aucun résultat',
  },
  en: {
    // Common
    loading: 'Loading...',

    // Metadata
    appTitle: 'Treasure Hunts',
    appDescription: 'Choose your treasure hunt',
    huntNotFoundTitle: 'Hunt not found',

    // Mobile & Orientation
    mobileOnly: 'This application is only compatible with mobile devices.',
    mobileOnlyHelper: 'Please open it on your mobile device.',
    landscapeNotSupported: 'Landscape mode is not supported.',

    // API Key
    apiKeyLabel: 'Access Key',
    apiKeyPlaceholder: 'Access Key',
    apiKeyHelper: 'Please enter the access key provided by your host.',
    apiKeyInvalid: 'The entered key seems invalid. Please check your input.',
    apiKeySave: 'Save',

    // Password for decryption
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    passwordHelper: 'Please enter the password provided by your host to unlock the application.',
    passwordInvalid: 'Incorrect password. Please try again.',
    unlock: 'Unlock',
    decrypting: 'Decrypting...',
    error: 'Error',
    noEncryptedKey: 'No encrypted key found. Please deploy the application with a password.',

    // Hunts List
    huntsListTitle: 'Available Treasure Hunts',
    huntStart: 'Start',

    // Not Found
    notFoundTitle: '404 - Hunt Not Found',
    notFoundMessage: 'The hunt you are looking for does not exist or has been removed.',
    notFoundBackButton: 'Back to hunts list',

    // Toast messages
    keywordFound: 'Congratulations! You found a keyword leading to the treasure!',
    keywordAlreadyFound: 'You already found this keyword!',

    // Map
    searchPlaceholder: 'Search for a place...',
    noResults: 'No results',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.fr;
