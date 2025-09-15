import {createContext, ReactNode, useState} from "react";

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
