import {type Metadata} from "next";
import {getHunt} from "@/utils/config";
import {notFound} from "next/navigation";
import {Hunt} from "@/components/Hunt/Hunt";

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata | undefined> {
  const hunt = getHunt((await params).slug);
  if (!hunt) {
    return undefined;
  }

  return {
    title: hunt.name,
  };
}

export default async function Page({params}: { params: Promise<{ slug: string }> }) {
  const hunt = getHunt((await params).slug);
  if (!hunt) {
    return notFound();
  }

  // https://github.com/vercel/next.js/discussions/46137
  return <Hunt hunt={JSON.parse(JSON.stringify(hunt))}/>;
}
