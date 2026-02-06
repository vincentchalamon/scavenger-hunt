import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useToast} from "@/contexts/ToastContext";
import {getKeywords, saveKeywords} from "@/lib/storage";
import {useTranslation} from "@/i18n";

type PhraseContextType = {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  huntSlug: string,
};

export const PhraseContext = createContext<PhraseContextType>({
  keywords: [],
  setKeywords: (_keywords: string[]) => {},
  huntSlug: '',
});

export function PhraseProvider({ children, defaultKeywords = [], huntSlug }: { children: ReactNode, defaultKeywords?: string[], huntSlug: string }) {
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords);
  useEffect(() => {
    setKeywords(getKeywords(huntSlug, defaultKeywords));
  }, [huntSlug]);

  return (
    // @ts-ignore
    <PhraseContext.Provider value={{keywords, setKeywords, huntSlug}}>
      {children}
    </PhraseContext.Provider>
  );
}

export const useKeyword = () => {
  const {keywords, setKeywords, huntSlug} = useContext(PhraseContext);
  const {addToast} = useToast();
  const {t} = useTranslation();

  const addKeyword = (keyword: string, toast?: string) => {
    const newKeywords = [...keywords, keyword].filter((value, index, self) => self.indexOf(value) === index);

    // @ts-ignore
    if (!keywords.includes(keyword)) {
      setKeywords(newKeywords);
      saveKeywords(huntSlug, newKeywords);
      // Note: toast parameter allows custom messages from components if needed
      addToast(toast || t('keywordFound'), "success");
    }
  };

  return {addKeyword};
};
