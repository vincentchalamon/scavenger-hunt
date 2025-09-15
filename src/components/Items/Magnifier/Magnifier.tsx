"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button} from "react-bootstrap";
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

  render(): ReactNode {
    return (
      <ModalItem button={<Button variant="primary">Magnifier</Button>}>
        <div className="d-flex flex-column justify-content-center align-items-center w-100 mw-100 mh-100">
          <LookingGlass src={this.options.image} zoomFactor={3}/>
        </div>
      </ModalItem>
    );
  }
}
