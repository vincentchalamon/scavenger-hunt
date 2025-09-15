"use client";

import {Item as ItemType} from "@/types/Item";
import React, {ReactNode} from "react";
import {Button, Image as Img, Image} from "react-bootstrap";
import {ItemFactory, ItemType as ItemTypeEnum} from "@/components/Items/ItemFactory";
import {Item, ModalItem} from "@/components/Items";
import {hasKeyword} from "@/contexts/PhraseContext";

interface ClickableAreaProps {
  top?: string,
  bottom?: string,
  left?: string,
  right?: string,
  width: string,
  height: string,
  action: ItemType,
}

interface ClickableImageProps {
  image: string,
  icon: string,
  clickableAreas: ClickableAreaProps[],
}

export class ClickableImage extends Item {
  constructor(private options: ClickableImageProps) {
    super();
  }

  render(): ReactNode {
    return (
      <ModalItem button={
        <Button variant="link" className="h-100">
          <Img src={this.options.icon} className="w-100 mh-100"/>
        </Button>
      }>
        <div className="position-relative d-flex flex-column justify-content-center align-items-center w-100 mw-100 mh-100">
          <Image src={this.options.image} className="mh-100 mw-100"/>
          {this.options.clickableAreas.map((clickableArea, i) => {
            if (clickableArea.action.type === ItemTypeEnum.KEYWORD && hasKeyword(clickableArea.action.options?.keyword as string)) {
              return;
            }

            return (
              <div key={i} className="position-absolute" style={clickableArea}>
                {ItemFactory.create(clickableArea.action).render({display: 'none'})}
              </div>
            );
          })}
        </div>
      </ModalItem>
    );
  }
}
