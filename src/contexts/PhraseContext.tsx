import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useToast} from "@/contexts/ToastContext";
import {getKeywords, saveKeywords} from "@/lib/storage";
import {useTranslation} from "@/i18n";

type PhraseContextType = {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  huntSlug: string;
  phrase: string;
  defaultKeywords: string[];
};

export const PhraseContext = createContext<PhraseContextType>({
  keywords: [],
  setKeywords: (_keywords: string[]) => {},
  huntSlug: '',
  phrase: '',
  defaultKeywords: [],
});

export function PhraseProvider({ children, defaultKeywords = [], huntSlug, phrase }: { children: ReactNode, defaultKeywords?: string[], huntSlug: string, phrase: string }) {
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords);
  useEffect(() => {
    setKeywords(getKeywords(huntSlug, defaultKeywords));
  }, [huntSlug]);

  return (
    // @ts-ignore
    <PhraseContext.Provider value={{keywords, setKeywords, huntSlug, phrase, defaultKeywords}}>
      {children}
    </PhraseContext.Provider>
  );
}

export const useKeyword = () => {
  const {keywords, setKeywords, huntSlug, phrase, defaultKeywords} = useContext(PhraseContext);
  const {addToast} = useToast();
  const {t} = useTranslation();

  const addKeyword = (keyword: string, toast?: string) => {
    const newKeywords = [...keywords, keyword].filter((value, index, self) => self.indexOf(value) === index);

    // @ts-ignore
    if (!keywords.includes(keyword)) {
      setKeywords(newKeywords);
      saveKeywords(huntSlug, newKeywords);

      // Calculate the total number of unique keywords to find
      const uniqueWordsInPhrase = [...new Set(phrase.split(' '))];
      const totalKeywords = uniqueWordsInPhrase.length - defaultKeywords.length;
      const foundKeywords = newKeywords.length - defaultKeywords.length;

      // Use the appropriate translation key
      const messageKey = foundKeywords >= totalKeywords ? 'allKeywordsFound' : 'keywordFound';

      // Note: toast parameter allows custom messages from components if needed
      addToast(toast || t(messageKey), "success");
    }
  };

  return {addKeyword};
};
