import {Item} from "@/types/Item";

export interface Hunt {
  name: string;
  lang: string;
  manuscript: string;
  items: Item[];
  slug: string;
  url: string;
}
