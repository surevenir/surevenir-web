"use server";

import { getMerchants } from "@/utils/merchantActions";
import DashboardMerchantView from "./DashboardMerchantView";
import { getMarkets } from "@/utils/marketActions";

export default async function DashboardMerchantsPage() {
  const merchants = (await getMerchants()) || [];
  const markets = (await getMarkets()) || [];

  return (
    <>
      <DashboardMerchantView merchants={merchants} markets={markets} />
    </>
  );
}
