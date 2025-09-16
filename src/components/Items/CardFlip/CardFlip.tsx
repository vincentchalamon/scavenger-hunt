"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class CardFlip extends Item {
  renderButton(): ReactNode {
    return (
      <Button variant="link" className="p-0 h-100 w-100">
        CardFlip
      </Button>
    );
  }

  onHide(): void {
  }

  onShow(): void {
  }

  render(): ReactNode {
    return <p>This is a CardFlip</p>
  }
}
