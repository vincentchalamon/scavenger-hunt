"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button} from "react-bootstrap";
import {ModalItem} from "@/components/Items";
// @ts-ignore
import {GlassMagnifier} from "react-image-magnifiers";

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
          <GlassMagnifier
            imageSrc={this.options.image}
            className="mh-100 mw-100"
            largeImageSrc={this.options.image}
            allowOverflow={true}
            magnifierSize="30%"
            magnifierBorderSize={0}
            magnifierBorderColor="rgba(255, 255, 255, 0.5)"
            square={false}
          />
        </div>
      </ModalItem>
    );
  }
}
