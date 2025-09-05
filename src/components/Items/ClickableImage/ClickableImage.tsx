"use client";

import {Item as ItemType} from "@/types/Item";
import React, {ReactNode} from "react";
import {Button, Image} from "react-bootstrap";
import {ItemFactory, ItemType as ItemTypeEnum} from "@/components/Items/ItemFactory";
import {Item, ModalItem} from "@/components/Items";

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
  clickableAreas: ClickableAreaProps[],
}

export class ClickableImage extends Item {
  constructor(private options: ClickableImageProps) {
    super();
    this.options.clickableAreas.map((item) => {
      if (item.action.type !== ItemTypeEnum.IMAGE && item.action.type !== ItemTypeEnum.KEYWORD) {
        throw new Error('Clickable image only supports "image" and "keyword" action types.');
      }
    })
  }

  render(): ReactNode {
    return (
      <ModalItem button={<Button variant="primary">Clickable image</Button>}>
        <div className="position-relative">
          <Image src={this.options.image} className="w-100 mh-100"/>
          {this.options.clickableAreas.map((clickableArea, i) => {
            if (clickableArea.action.type === ItemTypeEnum.IMAGE) {
              return (
                <ModalItem key={i} button={<Button className="position-absolute" style={clickableArea}/>}>
                  {ItemFactory.create(clickableArea.action).render()}
                </ModalItem>
              );
            }

            return (
              <div key={i} className="position-absolute" style={clickableArea}>
                {ItemFactory.create(clickableArea.action).render()}
              </div>
            );
          })}
        </div>
      </ModalItem>
    );
  }
}
