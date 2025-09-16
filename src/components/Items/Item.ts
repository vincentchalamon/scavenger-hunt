import {ReactNode} from "react";

export abstract class Item {
  abstract renderButton(): ReactNode;
  abstract render(): ReactNode;
  abstract onHide(): void;
  abstract onShow(): void;
}
