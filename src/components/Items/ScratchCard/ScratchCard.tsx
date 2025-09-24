"use client";

import {Item, ItemFactory, ItemType as ItemTypeInterface, ModalItem} from "@/components/Items";
import React, {ReactNode, useEffect, useState} from "react";
// @ts-ignore
import ReactScratchCard from 'react-scratchcard-v4';
import {ItemOptionsType} from "@/types/Item";
import {Button, Image, Image as Img} from "react-bootstrap";

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

type ScratchCardProps = {
  image: string;
  scratchableAreas: ScratchableAreaProps[];
}

export class ScratchCard extends Item {
  private keyword: string|undefined = undefined;

  constructor(private options: ScratchCardProps & ItemOptionsType) {
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
      <Img src={this.options.image} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle">
        <ReactScratchCard
          width={300}
          height={700}
          image={this.options.image}
          finishPercent={80}
          fadeOutOnComplete={false}
          // @ts-ignore
          customCheckZone={{x: 0, y: 350, width: 300, height: 15}}
          onComplete={() => this.options.onKeywordClicked(this.keyword)}
        >
          <div className="align-items-center justify-content-center w-100 h-100 d-flex">
            {this.options.scratchableAreas.map((scratchableArea, i) => (
              <h1 className="m-3" key={`scratchable-area-${i}`}>{scratchableArea.text}</h1>
            ))}
          </div>
        </ReactScratchCard>
      </div>
    );
  }
}
