"use client";

import {Item as ItemType} from "@/types/Item";
import {ItemType as ItemTypeInterface} from "@/components/Items/ItemFactory";
import React, {ReactNode} from "react";
import {Button, Image as Img, Image} from "react-bootstrap";
import {ItemFactory} from "@/components/Items/ItemFactory";
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
  icon: string,
  image: string,
  clickableAreas: ClickableAreaProps[],
}

export class ClickableImage extends Item {
  constructor(private options: ClickableImageProps) {
    super();
  }

  renderButton(): ReactNode {
    return (
      <Button variant="link" className="h-100">
        <Img src={this.options.icon} className="w-100 mh-100"/>
      </Button>
    );
  }

  onHide(): void {
  }

  onShow(): void {
  }

  render(): ReactNode {
    return (
      <div className="position-relative d-flex flex-column justify-content-center align-items-center mw-100 mh-100">
        <Image src={this.options.image} className="mh-100 mw-100"/>
        {this.options.clickableAreas.map((clickableArea, i) => {
          const itemComponent = ItemFactory.create(clickableArea.action);

          return (
            <div key={i} className="position-absolute" style={clickableArea}>
              {clickableArea.action.type === ItemTypeInterface.KEYWORD && itemComponent.render() || (
                <ModalItem button={<Button className="h-100 mh-100 w-100"/>} onHide={itemComponent.onHide} onShow={itemComponent.onShow}>
                  {itemComponent.render()}
                </ModalItem>
              )}
            </div>
          )
        })}
      </div>
    );
  }
}
