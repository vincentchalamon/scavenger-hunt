import {Hunt} from "@/types/Hunt";
import slugify from "slugify";
import config from "../../config.json";
import {Place} from "@/types/Place";

export const getHunts = (): Hunt[] => config.map((hunt): Hunt => {
  const slug = slugify(hunt.name, {lower: true, strict: true, locale: hunt.lang});

  return {
    ...hunt,
    slug: slug,
    url: `/${slug}`,
    places: hunt.places.map((place): Place => {
      return {
        ...place,
        item: {
          ...place.item || {},
          options: {
            ...place.item?.options || {},
            debug: typeof hunt.debug === "boolean" ? hunt.debug : (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
          },
        },
      };
    }),
  }
});

export const getHunt = (slug: string): Hunt | undefined => getHunts().find((hunt: Hunt): boolean => hunt.slug === slug);
