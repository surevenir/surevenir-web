"use server";

import { cookies } from "next/headers";
import { getMerchants } from "@/utils/merchantActions";
import DashboardMerchantView from "./DashboardMerchantView";
import { getMarkets } from "@/utils/marketActions";

export default async function DashboardMerchantsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const merchants = (await getMerchants(token as string)) || [];
  const markets = (await getMarkets(token as string)) || [];

  return (
    <>
      <DashboardMerchantView merchants={merchants} markets={markets} />
    </>
  );
}
