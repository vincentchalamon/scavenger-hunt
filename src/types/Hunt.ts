import {Place} from "@/types/Place";

export type Hunt = {
  slug: string;
  name: string;
  lang?: string;
  description?: string;
  duration?: string;
  coordinates: google.maps.LatLngLiteral;
  debug?: boolean;
  rules?: string; // Deprecated: rules are now in translations
  manuscript: string;
  phrase: string;
  defaultKeywords?: string[];
  places: Place[];
}
