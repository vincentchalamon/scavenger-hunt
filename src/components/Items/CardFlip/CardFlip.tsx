"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class CardFlip extends Item {
  icon(onClick: () => void): ReactNode {
    return <Button variant="primary" onClick={onClick}>Card flip</Button>;
  }

  render(): ReactNode {
    return <p>This is a CardFlip</p>
  }
}
