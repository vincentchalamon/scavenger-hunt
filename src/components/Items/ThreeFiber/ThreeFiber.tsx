"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class ThreeFiber extends Item {
  renderButton(): React.ReactNode {
    return (
      <Button variant="link" className="h-100">
        ThreeFiber
      </Button>
    );
  }

  render(): ReactNode {
    return <p>This is a ThreeFiber</p>
  }
}
