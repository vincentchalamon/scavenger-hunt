"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class WindmillSpinner extends Item {
  renderButton(): ReactNode {
    return (
      <Button variant="link" className="h-100">
        WindmillSpinner
      </Button>
    );
  }

  onHide(): void {
  }

  onShow(): void {
  }

  render(): ReactNode {
    return <p>This is a WindmillSpinner</p>
  }
}
