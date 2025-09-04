"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class WindmillSpinner extends Item {
  icon(onClick: () => void): ReactNode {
    return <Button variant="primary" onClick={onClick}>Windmill spinner</Button>;
  }

  render(): ReactNode {
    return <p>This is a WindmillSpinner</p>
  }
}
