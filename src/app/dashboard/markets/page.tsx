"use server";

import { cookies } from "next/headers";
import { getMarkets } from "@/utils/marketActions";
import DashboardMarketView from "./DashboardMarketView";

export default async function DashboardMarketPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const markets = (await getMarkets(token as string)) || [];

  return (
    <>
      <DashboardMarketView markets={markets} />
    </>
  );
}
