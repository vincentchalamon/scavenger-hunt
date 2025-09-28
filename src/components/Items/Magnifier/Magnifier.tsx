"use client";

import {Item} from "@/components/Items";
import React, {ReactNode} from "react";
import LookingGlass from "./LookingGlass";
import {ItemOptionsType} from "@/types/Item";
import {Image as Img} from "react-bootstrap";
import {useKeyword} from "@/contexts/PhraseContext";

type Position = {
  x: number;
  y: number;
}

type MagnifierProps = ItemOptionsType & {
  image: string;
  keyword?: string;
  keywordPosition?: Position;
}

export class Magnifier extends Item {
  constructor(private options: MagnifierProps) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.image} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <Component image={this.options.image} keyword={this.options.keyword} keywordPosition={this.options.keywordPosition}/>
    );
  }
}

const Component: React.FC<MagnifierProps> = ({image, keyword, keywordPosition}) => {
  const {addKeyword} = useKeyword();

  const onCursorMove = (position: Position) => {
    if (keyword && keywordPosition
      && (position.x >= (keywordPosition.x-30) && position.x <= (keywordPosition.x+30))
      && (position.y >= (keywordPosition.y-30) && position.y <= (keywordPosition.y+30))
    ) {
      addKeyword(keyword);
    }
  };

  return (
    <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}}>
      <LookingGlass src={image} zoomFactor={3} imageClassName="mh-100 mw-100" onCursorMove={onCursorMove}/>
    </div>
  );
}
