import {Item} from "@/types/Item";

export type Place = {
  name: string;
  description: string;
  link?: string;
  coordinates: {lat: number; lng: number};
  coordinateMargin?: number; // Margin of error for coordinate proximity check (in degrees, ~111m per 0.001 at equator)
  item?: Item;
}
