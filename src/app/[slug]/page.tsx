import {type Metadata} from "next";
import {Hunt} from "@/components/Hunt/Hunt";
import {getHuntBySlug, getAllHunts} from "@/lib/hunts";
import {notFound} from "next/navigation";
import {getDefaultTranslations} from "@/i18n/server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const hunts = getAllHunts();
  return hunts.map((hunt) => ({
    slug: hunt.slug,
  }));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  const hunt = getHuntBySlug(slug);
  const { t } = getDefaultTranslations();

  if (!hunt) {
    return {
      title: t('huntNotFoundTitle'),
    };
  }

  return {
    title: hunt.name,
  };
}

export default async function Page({params}: PageProps) {
  const {slug} = await params;
  const hunt = getHuntBySlug(slug);

  if (!hunt) {
    return notFound();
  }

  // https://github.com/vercel/next.js/discussions/46137
  return <Hunt hunt={JSON.parse(JSON.stringify(hunt))}/>;
}
