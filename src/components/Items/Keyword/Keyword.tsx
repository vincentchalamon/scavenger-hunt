"use client";

import {Item} from "@/components/Items";
import React, {ReactNode} from "react";
import {Button} from "react-bootstrap";
import {ItemOptionsType} from "@/types/Item";
import {useKeyword} from "@/contexts/PhraseContext";

type KeywordProps = ItemOptionsType & {
  keyword: string;
};

export class Keyword extends Item {
  constructor(private options: KeywordProps) {
    super();
  }

  renderImage(): ReactNode {
    throw new Error('Keyword::renderImage is not implemented');
  }

  render(): ReactNode {
    return (
      <Component keyword={this.options.keyword} debug={this.options.debug}/>
    );
  }
}

const Component: React.FC<KeywordProps> = ({keyword, debug}) => {
  const {addKeyword} = useKeyword();

  const onKeywordClicked = () => addKeyword(keyword);

  return (
    // @ts-ignore
    <Button className="h-100 w-100 opacity-50" variant={debug ? "primary" : "link"} onClick={onKeywordClicked}/>
  );
}
