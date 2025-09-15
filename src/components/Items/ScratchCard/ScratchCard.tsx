"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode, useContext, useEffect, useState} from "react";
import {Button, Image as Img} from "react-bootstrap";
// @ts-ignore
import ReactScratchCard from 'react-scratchcard-v4';
import {ModalItem} from "@/components/Items";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ToastContext} from "@/contexts/ToastContext";

interface ScratchableAreaProps {
  top?: string,
  bottom?: string,
  left?: string,
  right?: string,
  width: string,
  height: string,
  text: string,
  keyword: boolean,
}

interface ScratchCardProps {
  icon: string;
  image: string;
  scratchableAreas: ScratchableAreaProps[];
}

export class ScratchCard extends Item {
  private keyword: string|undefined = undefined;

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

  render(buttonStyle = {}): ReactNode {
    const [height, setHeight] = useState<number | undefined>(undefined);
    const [width, setWidth] = useState<number | undefined>(undefined);
    const {keywords, setKeywords} = useContext(PhraseContext);
    const {setToast} = useContext(ToastContext);

    if (typeof screen !== "undefined") {
      useEffect(() => {
        setHeight(screen.height);
        setWidth(screen.width);
      }, [screen]);
    }

    return (
      <ModalItem button={
        <Button variant="link" className="h-100" style={buttonStyle}>
          <Img src={this.options.icon} className="w-100 mh-100"/>
        </Button>
      }>
        <div className="position-relative d-flex flex-column justify-content-center align-items-center w-100 mw-100 mh-100">
          <ReactScratchCard
            width={width}
            height={height}
            image={this.options.image}
            finishPercent={80}
            fadeOutOnComplete={false}
            customCheckZone={{x: 0, y: height/2, width: width, height: 15}}
            onComplete={() => {
              if (!keywords.includes(this.keyword)) {
                setKeywords([...keywords, this.keyword].filter((value, index, self) => self.indexOf(value) === index));
                setToast('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !');
              }
            }}
          >
            <div className="align-items-center justify-content-center w-100 h-100 d-flex">
              {this.options.scratchableAreas.map((scratchableArea, i) => (
                <h1 className="m-3" key={i}>{scratchableArea.text}</h1>
              ))}
            </div>
          </ReactScratchCard>
        </div>
      </ModalItem>
    );
  }
}
