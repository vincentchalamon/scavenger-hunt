"use client";

import {Item} from "@/components/Items";
import React, {ReactNode} from "react";
// @ts-ignore
// import ReactScratchCard from 'react-scratchcard-v4';
import {ReactScratchCard} from "./ReactScratchCard";
import {ItemOptionsType} from "@/types/Item";
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

type ScratchCardProps = ItemOptionsType & {
  image: string;
  width: number;
  height: number;
  scratchableAreas: ScratchableAreaProps[];
}

export class ScratchCard extends Item {
  private keyword: string;

  constructor(private options: ScratchCardProps) {
    super();
    const nbKeywords = this.options.scratchableAreas.filter((scratchableArea) => scratchableArea.keyword).length;
    if (nbKeywords > 1) {
      throw new Error('Scratchable card only supports one keyword scratchable area.');
    }
    if (nbKeywords === 0) {
      throw new Error('Scratchable card requires a keyword scratchable area.');
    }
    // @ts-ignore
    this.keyword = this.options.scratchableAreas.filter((scratchableArea) => scratchableArea.keyword)[0].text;
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.image} className="mw-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <Component
        image={this.options.image}
        width={this.options.width}
        height={this.options.height}
        scratchableAreas={this.options.scratchableAreas}
        keyword={this.keyword}
      />
    );
  }
}

const Component: React.FC<ScratchCardProps & {keyword: string}> = ({image, width, height, scratchableAreas, keyword}) => {
  const {addKeyword} = useKeyword();

  const onKeywordFound = () => addKeyword(keyword);

  return (
    <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle">
      <ReactScratchCard
        width={width}
        height={height}
        image={image}
        finishPercent={80}
        fadeOutOnComplete={false}
        // @ts-ignore
        customCheckZone={{x: 0, y: height/3, width: (80*width)/100, height: height/4}}
        onComplete={onKeywordFound}
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
