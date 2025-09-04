import {ReactNode} from "react";

export abstract class Item {
  abstract icon(onClick: () => void): ReactNode;
  abstract render(): ReactNode;
}
