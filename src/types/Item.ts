import {ClickableImageProps} from "@/components/Items/ClickableImage/ClickableImage";
import {ScratchCardProps} from "@/components/Items/ScratchCard/ScratchCard";
import {CardFlipProps} from "@/components/Items/CardFlip/CardFlip";
import {PageFlipProps} from "@/components/Items/PageFlip/PageFlip";
import {ThreeFiberProps} from "@/components/Items/ThreeFiber/ThreeFiber";
import {MagnifierProps} from "@/components/Items/Magnifier/Magnifier";
import {ImageProps} from "@/components/Items/Image/Image";
import {KeywordProps} from "@/components/Items/Keyword/Keyword";

export type Item = {
  type: string;
  options: CardFlipProps | ClickableImageProps | ImageProps | KeywordProps | MagnifierProps | PageFlipProps | ScratchCardProps | ThreeFiberProps;
}
