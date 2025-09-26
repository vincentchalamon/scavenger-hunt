import {type Metadata} from "next";
import {Hunt} from "@/components/Hunt/Hunt";
import {Hunt as HuntType} from "@/types/Hunt";
import config from "../../config.json";
import slugify from "slugify";
import {Place} from "@/types/Place";

const getHunt = (): HuntType => {
  const hunt = config as HuntType;
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
};

export async function generateMetadata(): Promise<Metadata | undefined> {
  const hunt = getHunt();

  return {
    title: hunt.name,
  };
}

export default async function Page() {
  const hunt = getHunt();

  // https://github.com/vercel/next.js/discussions/46137
  return <Hunt hunt={JSON.parse(JSON.stringify(hunt))}/>;
}
