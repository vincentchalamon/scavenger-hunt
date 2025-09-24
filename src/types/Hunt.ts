import {Item} from "@/types/Item";
import {Place} from "@/types/Place";

export type Hunt = {
  name: string;
  lang: string;
  manuscript: string;
  phrase: string;
  places: Place[];
  items: Item[];
  slug: string;
  url: string;
}
