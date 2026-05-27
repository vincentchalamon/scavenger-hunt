import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {getKeywords, saveKeywords} from "@/lib/storage";
import {useMoment} from "@/contexts/MomentContext";

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
  const {keywords, setKeywords, huntSlug} = useContext(PhraseContext);
  const {showKeywordFound} = useMoment();

  const addKeyword = (keyword: string, _toast?: string) => {
    const newKeywords = [...keywords, keyword].filter((value, index, self) => self.indexOf(value) === index);

    if (!keywords.includes(keyword)) {
      setKeywords(newKeywords);
      saveKeywords(huntSlug, newKeywords);

      // Celebrate the new word with the "mot trouvé" moment overlay.
      showKeywordFound(keyword, newKeywords);
    }
  };

  return {addKeyword};
};
