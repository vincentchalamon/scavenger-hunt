import HuntsList from "@/components/HuntsList/HuntsList";
import {getHunts} from "@/utils/config";
import type {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Scavenger Hunts',
  };
}

export default function Home() {
  return (
    <HuntsList hunts={getHunts()}/>
  );
}
