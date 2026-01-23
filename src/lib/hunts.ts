import config from "../../config.json";
import {Hunt} from "@/types/Hunt";
import {Place} from "@/types/Place";

export type Config = {
  hunts: Hunt[];
};

export const getConfig = (): Config => {
  return config as Config;
};

export const getAllHunts = (): Hunt[] => {
  return getConfig().hunts;
};

export const getHuntBySlug = (slug: string): Hunt | undefined => {
  const hunt = getAllHunts().find((h) => h.slug === slug);

  if (!hunt) {
    return undefined;
  }

  return {
    ...hunt,
    places: hunt.places.map((place): Place => {
      if (place.item) {
        place.item = {
          ...place.item || {},
          options: {
            ...place.item?.options || {},
            debug: typeof hunt.debug === "boolean" ? hunt.debug : (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
          },
        };
      }

      return place;
    }),
  };
};
