"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button, Image as Img} from "react-bootstrap";

interface ImageProps {
  image: string;
}

export class Image extends Item {
  constructor(private options: ImageProps) {
    super();
  }

  renderButton(): ReactNode {
    return (
      <Button variant="link" className="p-0 h-100 w-100">
        <Img src={this.options.image} className="w-100 h-100"/>
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
        <div style={{maxWidth: "95%", maxHeight: "95%", boxShadow: "0 0 20px black", border: "thin solid white"}}>
          <Img src={this.options.image} className="w-100 mh-100"/>
        </div>
      </div>
    );
  }
}
