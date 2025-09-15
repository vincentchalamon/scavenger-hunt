"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode, useContext} from "react";
import {Button} from "react-bootstrap";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ToastContext} from "@/contexts/ToastContext";

interface KeywordProps {
  keyword: string,
}

export class Keyword extends Item {
  constructor(private options: KeywordProps) {
    super();
  }

  renderButton(): React.ReactNode {
    throw new Error('Keyword cannot be rendered in the items list.');
  }

  render(): ReactNode {
    const {keywords, setKeywords} = useContext(PhraseContext);
    const {setToast} = useContext(ToastContext);

    return (
      <Button className="h-100 w-100" onClick={() => {
        // @ts-ignore
        if (!keywords.includes(this.options.keyword)) {
          setKeywords([...keywords, this.options.keyword].filter((value, index, self) => self.indexOf(value) === index));
          setToast('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !');
        }
      }}/>
    );
  }
}
