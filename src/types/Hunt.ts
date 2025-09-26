import {Place} from "@/types/Place";

export type Hunt = {
  name: string;
  coordinates: google.maps.LatLngLiteral;
  debug?: boolean;
  lang: string;
  manuscript: string;
  phrase: string;
  defaultKeywords?: string[];
  places: Place[];
  slug: string;
  url: string;
}
