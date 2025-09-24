"use client";

import {Item as ItemType} from "@/types/Item";
import {Item, ItemFactory, ItemType as ItemTypeInterface, ModalItem} from "@/components/Items";
import React, {ReactNode} from "react";
import {Button, Image as Img, Image} from "react-bootstrap";
import {ItemOptionsType} from "@/types/Item";

type ClickableAreaProps = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  height: string;
  action: ItemType;
}

type ClickableImageProps = {
  image: string;
  debug?: boolean;
  clickableAreas: ClickableAreaProps[];
}

export class ClickableImage extends Item {
  constructor(private options: ClickableImageProps & ItemOptionsType) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.image} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle position-relative">
        <Image src={this.options.image} className="mh-100 mw-100"/>
        {this.options.clickableAreas.map((clickableArea, i) => {
          const itemComponent = ItemFactory.create({...clickableArea.action, options: {...clickableArea.action.options, onKeywordClicked: this.options.onKeywordClicked}});

          return (
            <div key={`clickable-area-${i}`} className="position-absolute" style={clickableArea}>
              {clickableArea.action.type === ItemTypeInterface.KEYWORD && itemComponent.render() || (
                <ModalItem button={<Button variant={this.options.debug ? "primary" : "link"} className="p-0 m-0 w-100 h-100 mh-100 opacity-50"/>}>
                  <div className="d-flex flex-column justify-content-center align-items-center mw-100 mh-100">
                    {itemComponent.render()}
                  </div>
                </ModalItem>
              )}
            </div>
          )
        })}
      </div>
    );
  }
}
