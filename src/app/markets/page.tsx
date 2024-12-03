"use server";

import { cookies } from "next/headers";
import Footer from "@/components/footer";
import NavigationBar from "@/components/navigation-bar";
import MarketView from "./MarketView";
import { getMarkets } from "@/utils/marketActions";

export default async function MarketPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const markets = (await getMarkets(token as string)) || [];

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
