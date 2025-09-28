import {Item} from "@/types/Item";

export type Place = {
  name: string;
  description: string;
  link?: string;
  coordinates: google.maps.LatLngLiteral;
  item?: Item;
}
