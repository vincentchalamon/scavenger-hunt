"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button, Image as Img} from "react-bootstrap";
// @ts-ignore
import LookingGlass from "react-looking-glass";

interface MagnifierProps {
  icon: string,
  image: string,
}

export class Magnifier extends Item {
  constructor(private options: MagnifierProps) {
    super();
  }

  renderButton(): ReactNode {
    return (
      // @ts-ignore
      <Button variant="link" className="p-0 h-100 w-100">
        <Img src={this.options.icon} className="w-100 h-100"/>
      </Button>
    );
  }

  onHide(): void {
  }

  onShow(): void {
  }

  render(): ReactNode {
    return (
      <LookingGlass src={this.options.image} zoomFactor={4} imageClassName="mh-100 mw-100"/>
    );
  }
}
