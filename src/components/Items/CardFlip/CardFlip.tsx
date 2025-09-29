"use client";

import {Item} from "@/components/Items";
import React, {ReactNode, useState} from "react";
import {Button, Image as Img} from "react-bootstrap";
import {ItemOptionsType} from "@/types/Item";
import {ReactCardFlip} from "./ReactCardFlip";

type CardFlipProps = ItemOptionsType & {
  front: string;
  back: string;
}

export class CardFlip extends Item {
  constructor(private options: CardFlipProps) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.front} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <Component front={this.options.front} back={this.options.back}/>
    );
  }
}

const Component: React.FC<CardFlipProps> = ({front, back}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle">
      <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
        <div className="mh-100 mw-100">
          {/*@ts-ignore*/}
          <Button variant="link" onClick={() => setFlipped(!flipped)} className="p-0 m-0 w-100 h-100">
            <Img src={front} className="w-100 mh-100"/>
          </Button>
        </div>

        <div className="mh-100 mw-100">
          <Button variant="link" onClick={() => setFlipped(!flipped)} className="p-0 m-0 w-100 h-100">
            <Img src={back} className="w-100 mh-100"/>
          </Button>
        </div>
      </ReactCardFlip>
    </div>
  );
}
