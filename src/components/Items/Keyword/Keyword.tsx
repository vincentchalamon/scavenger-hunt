"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode} from "react";
import {Button} from "react-bootstrap";

export class Keyword extends Item {
  render(): ReactNode {
    return (
      <Button onClick={() => alert('Keyword found!')}/>
    );
  }
}
