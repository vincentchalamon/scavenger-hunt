"use client";

import {Item} from "@/components/Items";
import React, {ReactNode} from "react";
import {Button, Image as Img} from "react-bootstrap";
import {ItemOptionsType} from "@/types/Item";

type KeywordProps = {
  keyword: string;
  debug?: boolean;
  onKeywordClicked: (keyword: string) => void;
}

export class Keyword extends Item {
  constructor(private options: KeywordProps & ItemOptionsType) {
    super();
  }

  renderImage(): ReactNode {
    throw new Error('Keyword::renderImage is not implemented');
  }

  render(): ReactNode {
    return (
      <Button className="h-100 w-100 opacity-50" variant={this.options.debug ? "primary" : "link"} onClick={() => this.options.onKeywordClicked(this.options.keyword)}/>
    );
  }
}
