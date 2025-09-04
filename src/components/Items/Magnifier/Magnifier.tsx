"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class Magnifier extends Item {
  icon(onClick: () => void): ReactNode {
    return <Button variant="primary" onClick={onClick}>Magnifier</Button>;
  }

  render(): ReactNode {
    return <p>This is a Magnifier</p>
  }
}
