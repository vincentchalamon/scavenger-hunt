"use client";

import {Item} from "@/components/Items/Item";
import {ReactNode} from "react";

export class ClickableImage extends Item {
  icon(): ReactNode {
    return <div className="border bg-light text-dark p-1">Clickable image</div>;
  }
}
