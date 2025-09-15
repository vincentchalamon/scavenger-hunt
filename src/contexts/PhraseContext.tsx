import {createContext, ReactNode, useContext, useState} from "react";

export const PhraseContext = createContext({
  keywords: [],
  setKeywords: (_keywords: string[]) => {},
});

export function PhraseProvider({ children }: { children: ReactNode }) {
  const [keywords, setKeywords] = useState([]);

  return (
    <PhraseContext.Provider value={{keywords, setKeywords}}>
      {children}
    </PhraseContext.Provider>
  );
}

export function hasKeyword(keyword: string) {
  const {keywords} = useContext(PhraseContext);

  return keywords.includes(keyword);
}
