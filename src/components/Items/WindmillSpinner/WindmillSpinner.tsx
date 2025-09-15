"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class WindmillSpinner extends Item {
  render(buttonStyle = {}): ReactNode {
    return <p>This is a WindmillSpinner</p>
  }
}
