"use server";

import { cookies } from "next/headers";
import MarketView from "./MarketView";
import { getMarkets } from "@/utils/marketActions";

export default async function MarketPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const markets = (await getMarkets(token as string)) || [];

  return (
    <>
      <div className="px-4 md:px-16 lg:px-32 py-16 lg:py-32 w-full">
        <MarketView markets={markets} />
      </div>
    </>
  );
}
