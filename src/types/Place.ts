import {Item} from "@/types/Item";

export type Place = {
  name: string;
  description: string;
  link?: string;
  coordinates: {lat: number; lng: number};
  item?: Item;
}
