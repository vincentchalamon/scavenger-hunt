"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class WindmillSpinner extends Item {
  renderButton(): React.ReactNode {
    return (
      <Button variant="link" className="h-100">
        WindmillSpinner
      </Button>
    );
  }

  render(): ReactNode {
    return <p>This is a WindmillSpinner</p>
  }
}
