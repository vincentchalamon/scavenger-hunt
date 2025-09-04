"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class ScratchCard extends Item {
  icon(onClick: () => void): ReactNode {
    return <Button variant="primary" onClick={onClick}>Scratch card</Button>;
  }

  render(): ReactNode {
    return <p>This is a ScratchCard</p>
  }
}
