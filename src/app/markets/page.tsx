"use server";

import Footer from "@/components/footer";
import NavigationBar from "@/components/navigation-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { getMarkets } from "@/utils/actions";
import MarketView from "./MarketView";

export default async function MarketPage() {
  const markets = await getMarkets();

  return (
    <>
      <NavigationBar />
      <div className="px-32 py-4 w-full">
        <Skeleton className="w-full h-[200px]" />
        {markets && <MarketView markets={markets} />}
      </div>
      <Footer />
    </>
  );
}
