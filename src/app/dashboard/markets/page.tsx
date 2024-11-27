"use server";

import { getMarkets } from "@/utils/actions";
import DashboardMarketView from "./DashboardMarketView";

export default async function DashboardMarketPage() {
  const markets = await getMarkets();

  return (
    <>
      <DashboardMarketView markets={markets || []} />
    </>
  );
}
