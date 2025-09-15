"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Image as Img} from "react-bootstrap";

interface ImageProps {
  image: string;
}

export class Image extends Item {
  constructor(private options: ImageProps) {
    super();
  }

  render(): ReactNode {
    return <Img src={this.options.image} className="w-100 mh-100"/>;
  }
}
