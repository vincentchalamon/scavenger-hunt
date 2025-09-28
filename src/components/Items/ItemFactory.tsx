import {
  ClickableImage,
  Image,
  Item,
  Keyword,
  Magnifier,
  CardFlip,
  ScratchCard,
  ThreeFiber,
  PageFlip,
} from "@/components/Items";
import {ItemOptionsType} from "@/types/Item";

export enum ItemType {
  CLICKABLE_IMAGE = "clickable-image",
  IMAGE = "image",
  KEYWORD = "keyword",
  SCRATCH_CARD = "scratch-card",
  CARD_FLIP = "card-flip",
  PAGE_FLIP = "page-flip",
  THREE_FIBER = "three-fiber",
  MAGNIFIER = "magnifier",
}

export class ItemFactory {
  static create(params: { type: string, options?: any & ItemOptionsType }): Item {
    switch (params.type) {
      case ItemType.CLICKABLE_IMAGE:
        return new ClickableImage(params.options);
      case ItemType.IMAGE:
        return new Image(params.options);
      case ItemType.SCRATCH_CARD:
        return new ScratchCard(params.options);
      case ItemType.CARD_FLIP:
        return new CardFlip(params.options);
      case ItemType.PAGE_FLIP:
        return new PageFlip(params.options);
      case ItemType.THREE_FIBER:
        return new ThreeFiber(params.options);
      case ItemType.MAGNIFIER:
        return new Magnifier(params.options);
      case ItemType.KEYWORD:
        return new Keyword(params.options);
      default:
        throw new Error(`Item type ${params.type} not implemented`);
    }
  }
}
