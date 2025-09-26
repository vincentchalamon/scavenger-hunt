"use client";

import {Item} from "@/components/Items";
import React, {ReactNode} from "react";
// @ts-ignore
import LookingGlass from "react-looking-glass";
import {ItemOptionsType} from "@/types/Item";
import {Image as Img} from "react-bootstrap";

type MagnifierProps = ItemOptionsType & {
  image: string;
}

export class Magnifier extends Item {
  constructor(private options: MagnifierProps) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.image} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}}>
        <LookingGlass src={this.options.image} zoomFactor={4} imageClassName="mh-100 mw-100"/>
      </div>
    );
  }
}
