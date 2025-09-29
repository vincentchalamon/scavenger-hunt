"use client";

import {Item as ItemType} from "@/types/Item";
import {ItemEnum, RenderItem} from "@/components/Items/ItemFactory";
import {ModalItem} from "@/components/Items/ModalItem";
import React from "react";
import {Button, Image as Img, Image} from "react-bootstrap";

type ClickableAreaProps = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  height: string;
  action: ItemType;
}

export type ClickableImageProps = {
  debug?: boolean;
  image: string;
  clickableAreas: ClickableAreaProps[];
}

export const ClickableImageButton: React.FC<ClickableImageProps> = ({image}) => (
  <Img src={image} className="w-100 mh-100"/>
);

export const ClickableImage: React.FC<ClickableImageProps> = ({image, clickableAreas, debug}) => (
  <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle position-relative">
    <Image src={image} className="mh-100 mw-100"/>
    {clickableAreas.map((clickableArea, i) => {
      const item = {...clickableArea.action, options: {...clickableArea.action.options, debug: debug}};

      return (
        <div key={`clickable-area-${i}`} className="position-absolute" style={clickableArea}>
          {clickableArea.action.type === ItemEnum.KEYWORD && <RenderItem {...item}/> || (
            // @ts-ignore
            <ModalItem button={<Button variant={debug ? "primary" : "link"} className="p-0 m-0 w-100 h-100 mh-100 opacity-50"/>}>
              <div className="d-flex flex-column justify-content-center align-items-center mw-100 mh-100">
                <RenderItem {...item}/>
              </div>
            </ModalItem>
          )}
        </div>
      )
    })}
  </div>
)
