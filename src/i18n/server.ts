import { translations, Language, TranslationKey } from './translations';

/**
 * Get translation function for a specific language (build-time)
 * Since the app uses static export, we use the default language for metadata
 */
export function getStaticTranslations(language: Language = 'fr') {
  return {
    t: (key: TranslationKey): string => {
      // Cast to any to avoid TypeScript indexing error since all languages have the same keys
      return (translations[language] as any)[key] as string;
    },
    language,
  };
}

/**
 * Get default translations (French) for static metadata
 */
export function getDefaultTranslations() {
  return getStaticTranslations('fr');
}
