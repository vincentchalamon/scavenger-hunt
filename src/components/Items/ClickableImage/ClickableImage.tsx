"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class ClickableImage extends Item {
  icon(onClick: () => void): ReactNode {
    return <Button variant="primary" onClick={onClick}>Clickable image</Button>;
  }

  render(): ReactNode {
    return <p>This is a ClickableImage</p>
  }
}
