"use client";

import React from "react";
import {ReactScratchCard} from "./ReactScratchCard";
import {Image as Img} from "react-bootstrap";
import {useKeyword} from "@/contexts/PhraseContext";

type ScratchableAreaProps = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  height: string;
  text: string;
  keyword: boolean;
}

export type ScratchCardProps = {
  image: string;
  width: number;
  height: number;
  scratchableAreas: ScratchableAreaProps[];
}

export const ScratchCardButton: React.FC<ScratchCardProps> = ({image}) => (
  <Img src={image} className="mw-100 mh-100"/>
);

export const ScratchCard: React.FC<ScratchCardProps> = ({image, width, height, scratchableAreas}) => {
  const {addKeyword} = useKeyword();

  const nbKeywords = scratchableAreas.filter((scratchableArea: ScratchableAreaProps) => scratchableArea.keyword).length;
  if (nbKeywords > 1) {
    throw new Error('Scratchable card only supports one keyword scratchable area.');
  }
  if (nbKeywords === 0) {
    throw new Error('Scratchable card requires a keyword scratchable area.');
  }

  return (
    <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle">
      <ReactScratchCard
        width={width}
        height={height}
        image={image}
        finishPercent={80}
        fadeOutOnComplete={false}
        customCheckZone={{x: 0, y: height/3, width: (80*width)/100, height: height/4}}
        onComplete={() => addKeyword(scratchableAreas.filter((scratchableArea) => scratchableArea.keyword)[0].text)}
      >
        <div className="align-items-center justify-content-center w-100 h-100 d-flex">
          {scratchableAreas.map((scratchableArea, i) => (
            <h1 className="m-3" key={`scratchable-area-${i}`}>{scratchableArea.text}</h1>
          ))}
        </div>
      </ReactScratchCard>
    </div>
  );
}
