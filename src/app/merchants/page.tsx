"use server";

import { cookies } from "next/headers";
import MerchantView from "./MerchantView";
import { getMerchants } from "@/utils/merchantActions";

export default async function MarketPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const merchants = (await getMerchants(token as string)) || [];

  return (
    <>
      <div className="px-4 md:px-8 lg:px-32 py-16 lg:py-32 w-full">
        <MerchantView merchants={merchants} />
      </div>
    </>
  );
}
