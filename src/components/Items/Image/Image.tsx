"use client";

import {Item} from "@/components/Items";
import React, {ReactNode} from "react";
import {Image as Img} from "react-bootstrap";
import {ItemOptionsType} from "@/types/Item";

type ImageProps = {
  image: string;
}

export class Image extends Item {
  constructor(private options: ImageProps & ItemOptionsType) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.image} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid #555"}} className="bg-secondary-subtle">
        <Img src={this.options.image} className="w-100 mh-100"/>
      </div>
    );
  }
}
