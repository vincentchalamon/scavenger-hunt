"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button, Image as Img} from "react-bootstrap";
import {ModalItem} from "@/components/Items";
// @ts-ignore
import LookingGlass from "react-looking-glass";

interface MagnifierProps {
  image: string,
}

export class Magnifier extends Item {
  constructor(private options: MagnifierProps) {
    super();
  }

  render(buttonStyle = {}): ReactNode {
    return (
      <ModalItem button={
        <Button variant="link" className="p-0 h-100 w-100" style={buttonStyle}>
          <Img src={this.options.image} className="w-100 h-100"/>
        </Button>
      }>
        <div className="d-flex flex-column justify-content-center align-items-center w-100 mw-100 mh-100">
          <LookingGlass src={this.options.image} zoomFactor={3}/>
        </div>
      </ModalItem>
    );
  }
}
