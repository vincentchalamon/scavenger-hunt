import {ReactNode} from "react";

export abstract class Item {
  abstract renderImage(): ReactNode;
  abstract render(): ReactNode;
}
