import {type Metadata} from "next";
import {getAllHunts} from "@/lib/hunts";
import {HuntsList} from "@/components/HuntsList/HuntsList";
import {getDefaultTranslations} from "@/i18n/server";

const { t } = getDefaultTranslations();

export const metadata: Metadata = {
  title: `Scavenger Hunt - ${t('appTitle')}`,
  description: t('appDescription'),
};

export default async function Page() {
  const hunts = getAllHunts();

  return <HuntsList hunts={hunts}/>;
}
