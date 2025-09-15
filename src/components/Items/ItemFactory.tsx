import {Item} from "@/components/Items/Item";
import {
  CardFlip,
  ClickableImage,
  Compass,
  Image,
  Keyword,
  Magnifier,
  PageFlip,
  ScratchCard,
  ThreeFiber,
  WindmillSpinner,
} from "@/components/Items";

export enum ItemType {
  COMPASS = "compass",
  CLICKABLE_IMAGE = "clickable-image",
  IMAGE = "image",
  KEYWORD = "keyword",
  SCRATCH_CARD = "scratch-card",
  CARD_FLIP = "card-flip",
  PAGE_FLIP = "page-flip",
  THREE_FIBER = "three-fiber",
  MAGNIFIER = "magnifier",
  WINDMILL_SPINNER = "windmill-spinner",
}

export class ItemFactory {
  static create(params: { type: string, options?: any }): Item {
    switch (params.type) {
      case ItemType.COMPASS:
        return new Compass(params.options);
      case ItemType.CLICKABLE_IMAGE:
        return new ClickableImage(params.options);
      case ItemType.IMAGE:
        return new Image(params.options);
      case ItemType.SCRATCH_CARD:
        return new ScratchCard(params.options);
      case ItemType.CARD_FLIP:
        return new CardFlip();
      case ItemType.PAGE_FLIP:
        return new PageFlip(params.options);
      case ItemType.THREE_FIBER:
        return new ThreeFiber();
      case ItemType.MAGNIFIER:
        return new Magnifier(params.options);
      case ItemType.WINDMILL_SPINNER:
        return new WindmillSpinner();
      case ItemType.KEYWORD:
        return new Keyword(params.options);
      default:
        throw new Error(`Item type ${params.type} not implemented`);
    }
  }
}
