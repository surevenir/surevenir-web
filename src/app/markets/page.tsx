"use server";

import Footer from "@/components/footer";
import NavigationBar from "@/components/navigation-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { getMarkets } from "@/utils/actions";
import MarketView from "./MarketView";

export default async function MarketPage() {
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
      <NavigationBar />
      <div className="px-32 py-4 w-full">
        <Skeleton className="w-full h-[200px]" />
        <MarketView markets={markets} />
      </div>
      <Footer />
    </>
  );
}
