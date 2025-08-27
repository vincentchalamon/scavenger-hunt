import {Hunt} from "@/types/Hunt";
import slugify from "slugify";
import config from "../../config.json";

export const getHunts = (): Hunt[] => config.map((hunt): Hunt => {
  const slug = slugify(hunt.name, {lower: true, strict: true, locale: hunt.lang});

  return {
    ...hunt,
    slug: slug,
    url: `/${slug}`,
  }
});

export const getHunt = (slug: string): Hunt | undefined => getHunts().find((hunt: Hunt): boolean => hunt.slug === slug);
