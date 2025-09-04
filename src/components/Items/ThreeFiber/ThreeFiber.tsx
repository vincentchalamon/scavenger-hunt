"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class ThreeFiber extends Item {
  icon(onClick: () => void): ReactNode {
    return <Button variant="primary" onClick={onClick}>Three fiber</Button>;
  }

  render(): ReactNode {
    return <p>This is a ThreeFiber</p>
  }
}
