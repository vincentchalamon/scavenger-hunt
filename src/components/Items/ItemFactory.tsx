import {ClickableImage, ClickableImageProps, ClickableImageButton} from "@/components/Items/ClickableImage/ClickableImage";
import {ScratchCard, ScratchCardProps, ScratchCardButton} from "@/components/Items/ScratchCard/ScratchCard";
import {CardFlip, CardFlipProps, CardFlipButton} from "@/components/Items/CardFlip/CardFlip";
import {PageFlip, PageFlipProps, PageFlipButton} from "@/components/Items/PageFlip/PageFlip";
import {ThreeFiber, ThreeFiberProps, ThreeFiberButton} from "@/components/Items/ThreeFiber/ThreeFiber";
import {Magnifier, MagnifierProps, MagnifierButton} from "@/components/Items/Magnifier/Magnifier";
import {Image, ImageProps, ImageButton} from "@/components/Items/Image/Image";
import {Keyword, KeywordProps} from "@/components/Items/Keyword/Keyword";
import {Item as ItemType} from "@/types/Item";

export enum ItemEnum {
  CLICKABLE_IMAGE = "clickable-image",
  IMAGE = "image",
  KEYWORD = "keyword",
  SCRATCH_CARD = "scratch-card",
  CARD_FLIP = "card-flip",
  PAGE_FLIP = "page-flip",
  THREE_FIBER = "three-fiber",
  MAGNIFIER = "magnifier",
}

export const RenderItem: React.FC<ItemType> = ({type, options}) => {
  switch (type) {
    case ItemEnum.CLICKABLE_IMAGE:
      return <ClickableImage {...options as ClickableImageProps}/>;
    case ItemEnum.IMAGE:
      return <Image {...options as ImageProps}/>;
    case ItemEnum.SCRATCH_CARD:
      return <ScratchCard {...options as ScratchCardProps}/>;
    case ItemEnum.CARD_FLIP:
      return <CardFlip {...options as CardFlipProps}/>;
    case ItemEnum.PAGE_FLIP:
      return <PageFlip {...options as PageFlipProps}/>;
    case ItemEnum.THREE_FIBER:
      return <ThreeFiber {...options as ThreeFiberProps}/>;
    case ItemEnum.MAGNIFIER:
      return <Magnifier {...options as MagnifierProps}/>;
    case ItemEnum.KEYWORD:
      return <Keyword {...options as KeywordProps}/>;
    default:
      throw new Error(`Item type ${type} not implemented`);
  }
}

export const RenderButton: React.FC<ItemType> = ({type, options}) => {
  switch (type) {
    case ItemEnum.CLICKABLE_IMAGE:
      return <ClickableImageButton {...options as ClickableImageProps}/>;
    case ItemEnum.IMAGE:
      return <ImageButton {...options as ImageProps}/>;
    case ItemEnum.SCRATCH_CARD:
      return <ScratchCardButton {...options as ScratchCardProps}/>;
    case ItemEnum.CARD_FLIP:
      return <CardFlipButton {...options as CardFlipProps}/>;
    case ItemEnum.PAGE_FLIP:
      return <PageFlipButton {...options as PageFlipProps}/>;
    case ItemEnum.THREE_FIBER:
      return <ThreeFiberButton {...options as ThreeFiberProps}/>;
    case ItemEnum.MAGNIFIER:
      return <MagnifierButton {...options as MagnifierProps}/>;
    case ItemEnum.KEYWORD:
      throw new Error('KeywordButton is not implemented');
    default:
      throw new Error(`Item type ${type} not implemented`);
  }
}
