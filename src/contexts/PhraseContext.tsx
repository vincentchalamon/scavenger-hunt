import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useToast} from "@/contexts/ToastContext";

export const PhraseContext = createContext({
  keywords: [],
  setKeywords: (_keywords: string[]) => {},
});

export function PhraseProvider({ children, defaultKeywords = [] }: { children: ReactNode, defaultKeywords?: string[] }) {
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords);
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      setKeywords(JSON.parse(localStorage.getItem("keywords") || JSON.stringify(defaultKeywords)));
    }
  }, []);

  return (
    // @ts-ignore
    <PhraseContext.Provider value={{keywords, setKeywords}}>
      {children}
    </PhraseContext.Provider>
  );
}

export const useKeyword = () => {
  const {keywords, setKeywords} = useContext(PhraseContext);
  const {addToast} = useToast();

  const addKeyword = (keyword: string) => {
    const newKeywords = [...keywords, keyword].filter((value, index, self) => self.indexOf(value) === index);

    // @ts-ignore
    if (!keywords.includes(keyword)) {
      setKeywords(newKeywords);
      localStorage.setItem('keywords', JSON.stringify(newKeywords));
      addToast("Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !", "success");
    }
  };

  return {addKeyword};
};
