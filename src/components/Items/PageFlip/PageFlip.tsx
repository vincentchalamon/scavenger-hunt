"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class PageFlip extends Item {
  icon(onClick: () => void): ReactNode {
    return <Button variant="primary" onClick={onClick}>Page flip</Button>;
  }

  render(): ReactNode {
    return <p>This is a PageFlip</p>
  }
}
