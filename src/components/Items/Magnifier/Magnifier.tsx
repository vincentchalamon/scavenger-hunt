"use client";

import React from "react";
import {Coordinates, LookingGlass} from "./LookingGlass";
import {Image as Img} from "react-bootstrap";
import {useKeyword} from "@/contexts/PhraseContext";
import {useTranslation} from "@/i18n";

export type MagnifierProps = {
  image: string;
  keyword?: string;
  keywordPosition?: Coordinates;
}

export const MagnifierButton: React.FC<MagnifierProps> = ({image}) => (
  <Img src={image} className="w-100 mh-100"/>
);

export const Magnifier: React.FC<MagnifierProps> = ({image, keyword, keywordPosition}) => {
  const {addKeyword} = useKeyword();
  const { t } = useTranslation();

  const onCursorMove = (position: Coordinates) => {
    if (keyword && keywordPosition
      && (position.x >= (keywordPosition.x-40) && position.x <= (keywordPosition.x+40))
      && (position.y >= (keywordPosition.y-40) && position.y <= (keywordPosition.y+40))
    ) {
      addKeyword(keyword, t('allKeywordsFound'));
    }
  };

  return (
    <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}}>
      <LookingGlass src={image} zoomFactor={3} imageClassName="mh-100 mw-100" onCursorMove={onCursorMove}/>
    </div>
  );
}
