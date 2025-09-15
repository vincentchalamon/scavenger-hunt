"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode, useContext} from "react";
import {Button} from "react-bootstrap";
import {PhraseContext} from "@/contexts/PhraseContext";

interface KeywordProps {
  keyword: string,
}

export class Keyword extends Item {
  constructor(private options: KeywordProps) {
    super();
  }

  render(): ReactNode {
    const {keywords, setKeywords} = useContext(PhraseContext);

    return (
      <Button onClick={() => setKeywords([...keywords, this.options.keyword].filter((value, index, self) => self.indexOf(value) === index))}/>
    );
  }
}
