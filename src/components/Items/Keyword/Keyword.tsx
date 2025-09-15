"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode, useContext, useState} from "react";
import {Button, Toast} from "react-bootstrap";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ToastContext} from "@/contexts/ToastContext";

interface KeywordProps {
  keyword: string,
}

export class Keyword extends Item {
  constructor(private options: KeywordProps) {
    super();
  }

  render(): ReactNode {
    const {keywords, setKeywords} = useContext(PhraseContext);
    const {setToast} = useContext(ToastContext);

    const onClick = () => {
      setKeywords([...keywords, this.options.keyword].filter((value, index, self) => self.indexOf(value) === index));
      setToast('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !');
    };

    return <Button onClick={onClick}/>;
  }
}
