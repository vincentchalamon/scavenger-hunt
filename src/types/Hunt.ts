import {Place} from "@/types/Place";

export type Hunt = {
  name: string;
  coordinates: google.maps.LatLngLiteral;
  debug?: boolean;
  manuscript: string;
  phrase: string;
  defaultKeywords?: string[];
  places: Place[];
}
