"use server";

import { cookies } from "next/headers";
import MarketView from "./MarketView";
import { getMarkets } from "@/utils/marketActions";
import { TypographyH4 } from "@/components/ui/typography";

export default async function MarketPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const markets = (await getMarkets(token as string)) || [];

  return (
    <>
      <div className="px-32 py-16 w-full">
        <TypographyH4 className="pb-8">Market List</TypographyH4>
        <MarketView markets={markets} />
      </div>
    </>
  );
}
