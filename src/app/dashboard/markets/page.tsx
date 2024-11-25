"use server";

import { getMarkets } from "@/utils/actions";
import MarketView from "./MarketView";

export default async function ProductPage() {
  const markets = await getMarkets();

  if (!markets || markets.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">
          Failed to load markets or no markets available. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <>
      <MarketView markets={markets} />
    </>
  );
}
