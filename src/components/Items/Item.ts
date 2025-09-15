import {ReactNode} from "react";

export abstract class Item {
  abstract render(buttonStyle: object): ReactNode;
}
