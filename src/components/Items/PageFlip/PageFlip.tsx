"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode, useState} from "react";
import {Button, Image as Img} from "react-bootstrap";
import ReactCardFlip from 'react-card-flip';
import {ItemFactory} from "@/components/Items/ItemFactory";
import {Item as ItemType} from "@/types/Item";

interface PageFlipProps {
  icon: string,
  front: string,
  back: ItemType,
}

export class PageFlip extends Item {
  constructor(private options: PageFlipProps) {
    super();
  }

  renderButton(): React.ReactNode {
    return (
      <Button variant="link" className="p-0 h-100 w-100">
        <Img src={this.options.icon} className="w-100 h-100"/>
      </Button>
    );
  }

  render(): ReactNode {
    const [flipped, setFlipped] = useState(false);
    // onHide={() => setFlipped(false)}

    return (
      <div className="d-flex flex-column justify-content-center align-items-center w-100 mw-100 mh-100">
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
