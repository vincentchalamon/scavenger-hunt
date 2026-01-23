import {type Metadata} from "next";
import {getAllHunts} from "@/lib/hunts";
import {HuntsList} from "@/components/HuntsList/HuntsList";

export const metadata: Metadata = {
  title: "Scavenger Hunts",
  description: "Choisissez votre chasse au trésor",
};

export default async function Page() {
  const hunts = getAllHunts();

  return <HuntsList hunts={hunts}/>;
}
