"use server";

import Footer from "@/components/footer";
import NavigationBar from "@/components/navigation-bar";
import { Skeleton } from "@/components/ui/skeleton";
import MarketView from "./MarketView";
import { getMarkets } from "@/utils/marketActions";

export default async function MarketPage() {
  const markets = (await getMarkets()) || [];

  return (
    <>
      <NavigationBar />
      <div className="px-32 py-4 w-full">
        {markets && <MarketView markets={markets} />}
      </div>
      <Footer />
    </>
  );
}
