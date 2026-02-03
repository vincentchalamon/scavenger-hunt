import {Place} from "@/types/Place";

export type Hunt = {
  slug: string;
  name: string;
  coordinates: google.maps.LatLngLiteral;
  debug?: boolean;
  rules: string;
  manuscript: string;
  phrase: string;
  defaultKeywords?: string[];
  places: Place[];
}
