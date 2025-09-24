"use client";

import {Item, ItemFactory} from "@/components/Items";
import React, {ReactNode, useState} from "react";
import {Button, Image as Img} from "react-bootstrap";
import ReactCardFlip from 'react-card-flip';
import {ItemOptionsType} from "@/types/Item";

type CardFlipProps = {
  front: string;
  back: string;
}

export class CardFlip extends Item {
  constructor(private options: CardFlipProps & ItemOptionsType) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.front} className="w-100 mh-100"/>
    );
  }

  // todo setFlipped(false) on hide

  render(): ReactNode {
    const [flipped, setFlipped] = useState(false);

    return (
      <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle">
        <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
          <div className="mh-100 mw-100">
            <Button variant="link" onClick={() => setFlipped(true)} className="p-0 m-0 w-100 h-100">
              <Img src={this.options.front} className="w-100 mh-100"/>
            </Button>
          </div>

          <div className="mh-100 mw-100">
            <Img src={this.options.back} className="w-100 mh-100"/>
          </div>
        </ReactCardFlip>
      </div>
    );
  }
}
