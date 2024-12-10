"use server";

import { cookies } from "next/headers";
import { getMerchants } from "@/utils/merchantActions";
import DashboardMerchantView from "./DashboardMerchantView";
import { getMarkets } from "@/utils/marketActions";
import { getUserById } from "@/utils/userActions";

export default async function DashboardMerchantsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;

  const user = (await getUserById(token as string, token as string)) || {};

  const merchants =
    user.role == "ADMIN"
      ? (await getMerchants(token as string)) || []
      : (await getMerchants(token as string, true)) || [];

  const markets = (await getMarkets(token as string)) || [];

  return (
    <>
      <DashboardMerchantView merchants={merchants} markets={markets} />
    </>
  );
}
