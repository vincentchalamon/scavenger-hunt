"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode, useState} from "react";
import {Button, Image as Img} from "react-bootstrap";
import ReactCardFlip from 'react-card-flip';
import {ItemFactory} from "@/components/Items/ItemFactory";
import {Item as ItemType} from "@/types/Item";

interface CardFlipProps {
  icon: string,
  front: string,
  back: ItemType,
}

export class CardFlip extends Item {
  constructor(private options: CardFlipProps) {
    super();
  }

  renderButton(): ReactNode {
    return (
      // @ts-ignore
      <Button variant="link" className="p-0 h-100 w-100">
        <Img src={this.options.icon} className="w-100 h-100"/>
      </Button>
    );
  }

  onHide(): void {
    // todo setFlipped(false)
  }

  onShow(): void {
  }

  render(): ReactNode {
    const [flipped, setFlipped] = useState(false);

    return (
      <div className="position-relative d-flex flex-column justify-content-center align-items-center w-100 mw-100 mh-100">
        <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
          <div>
            <Button variant="link" onClick={() => setFlipped(true)}>
              <Img src={this.options.front} className="w-100 mh-100"/>
            </Button>
          </div>

          <div>
            {ItemFactory.create(this.options.back).render()}
          </div>
        </ReactCardFlip>
      </div>
    );
  }
}
