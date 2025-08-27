import {Item} from "@/components/Items/Item";
import {
  CardFlip,
  ClickableImage,
  Compass,
  Magnifier,
  PageFlip,
  ScratchCard,
  ThreeFiber,
  WindmillSpinner
} from "@/components/Items";

export enum ItemType {
  COMPASS = "compass",
  CLICKABLE_IMAGE = "clickable-image",
  SCRATCH_CARD = "scratch-card",
  CARD_FLIP = "card-flip",
  PAGE_FLIP = "page-flip",
  THREE_FIBER = "three-fiber",
  MAGNIFIER = "magnifier",
  WINDMILL_SPINNER = "windmill-spinner",
}

export class ItemFactory {
  static create(params: { name: string, type: string, options: any }): Item {
    switch (params.type) {
      case ItemType.COMPASS:
        return new Compass();
      case ItemType.CLICKABLE_IMAGE:
        return new ClickableImage();
      case ItemType.SCRATCH_CARD:
        return new ScratchCard();
      case ItemType.CARD_FLIP:
        return new CardFlip();
      case ItemType.PAGE_FLIP:
        return new PageFlip();
      case ItemType.THREE_FIBER:
        return new ThreeFiber();
      case ItemType.MAGNIFIER:
        return new Magnifier();
      case ItemType.WINDMILL_SPINNER:
        return new WindmillSpinner();
      default:
        throw new Error(`Item type ${params.type} not implemented`);
    }
  }
}
