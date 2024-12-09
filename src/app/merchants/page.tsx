"use server";

import { cookies } from "next/headers";
import { TypographyH4 } from "@/components/ui/typography";
import MerchantView from "./MerchantView";
import { getMerchants } from "@/utils/merchantActions";

export default async function MarketPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const merchants = (await getMerchants(token as string)) || [];

  return (
    <>
      <div className="px-4 md:px-8 lg:px-32 py-16 w-full">
        <TypographyH4 className="pb-8">Merchant List</TypographyH4>
        <MerchantView merchants={merchants} />
      </div>
    </>
  );
}
