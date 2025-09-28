import {type Metadata} from "next";
import {Hunt} from "@/components/Hunt/Hunt";
import {Hunt as HuntType} from "@/types/Hunt";
import config from "../../config.json";
import {Place} from "@/types/Place";

const getHunt = (): HuntType => {
  const hunt = config as HuntType;

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
