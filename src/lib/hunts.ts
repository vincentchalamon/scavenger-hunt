import rawConfig from "../../config.json";
import {Hunt} from "@/types/Hunt";
import {Place} from "@/types/Place";
import {assetPath} from "@/lib/assets";
import { configSchema } from "./config-schema";

export type Config = {
  hunts: Hunt[];
};

// Validate config.json file on load
const validateConfig = () => {
  try {
    return configSchema.parse(rawConfig);
  } catch (error) {
    console.error("❌ Error validating config.json file:");
    throw error;
  }
};

// Validate configuration when loading the module
const config = validateConfig();

/**
 * Recursively transform all asset paths in an object to include basePath
 */
const transformAssetPaths = (obj: any): any => {
  if (typeof obj === 'string') {
    // If it's a string starting with /assets/, transform it
    if (obj.startsWith('/assets/')) {
      return assetPath(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformAssetPaths);
  }

  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = transformAssetPaths(obj[key]);
    }
    return result;
  }

  return obj;
};

export const getConfig = (): Config => {
  return transformAssetPaths(config) as Config;
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
