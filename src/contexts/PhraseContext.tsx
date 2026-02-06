import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useToast} from "@/contexts/ToastContext";
import {getKeywords, saveKeywords} from "@/lib/storage";

export const PhraseContext = createContext({
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

  const addKeyword = (keyword: string, toast: string = "Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !") => {
    const newKeywords = [...keywords, keyword].filter((value, index, self) => self.indexOf(value) === index);

    // @ts-ignore
    if (!keywords.includes(keyword)) {
      setKeywords(newKeywords);
      saveKeywords(huntSlug, newKeywords);
      addToast(toast, "success");
    }
  };

  return {addKeyword};
};
